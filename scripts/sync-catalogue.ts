import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

// --- Types ---

interface VideoEntry {
  title: string;
  url: string;
  videoId: string;
}

interface ClassificationResult {
  title: string;
  classification: "beginner" | "intermediate" | "advanced" | "motivational";
}

interface LinksData {
  levels: {
    beginner: { title: string; url: string }[];
    intermediate: { title: string; url: string }[];
    advanced: { title: string; url: string }[];
  };
  motivation_and_soft_advice: { title: string; url: string }[];
}

// --- Config ---

const CHANNEL_HANDLE = "@AsliEngineering";
const CHANNEL_VIDEOS_URL = `https://www.youtube.com/${CHANNEL_HANDLE}/videos`;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = "nvidia/nemotron-3-super-120b-a12b:free";
const LINKS_JSON_PATH = path.join(process.cwd(), "data", "links.json");
const YOUTUBE_ID_REGEX = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

// --- YouTube Scraper ---

async function fetchChannelPage(): Promise<string> {
  const response = await fetch(CHANNEL_VIDEOS_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch channel page: ${response.status} ${response.statusText}`
    );
  }

  return await response.text();
}

function extractVideosFromPage(html: string): VideoEntry[] {
  const $ = cheerio.load(html);

  let ytInitialDataContent: string | null = null;

  $("script").each((_, el) => {
    const content = $(el).html() || "";
    if (content.startsWith("var ytInitialData = {") && content.length > 10000) {
      ytInitialDataContent = content;
    }
  });

  if (!ytInitialDataContent) {
    throw new Error(
      "Could not extract ytInitialData from channel page. YouTube may have changed its layout."
    );
  }

  const jsonStart = ytInitialDataContent.indexOf("{");
  const jsonEnd = ytInitialDataContent.lastIndexOf("}");
  const jsonStr = ytInitialDataContent.substring(jsonStart, jsonEnd + 1);
  const data = JSON.parse(jsonStr);

  const tabs = data.contents?.twoColumnBrowseResultsRenderer?.tabs;
  if (!tabs) {
    throw new Error("Could not find tabs in channel data.");
  }

  const videosTab = tabs.find(
    (t: Record<string, unknown>) => t.tabRenderer?.title === "Videos"
  );

  if (!videosTab) {
    throw new Error("Could not find Videos tab.");
  }

  const richGrid =
    videosTab.tabRenderer?.content?.richGridRenderer;
  if (!richGrid) {
    throw new Error("Could not find richGridRenderer in Videos tab.");
  }

  const contents = richGrid.contents || [];
  const videos: VideoEntry[] = [];
  const seen = new Set<string>();

  for (const item of contents) {
    const lockup = item.richItemRenderer?.content?.lockupViewModel;
    if (!lockup) continue;

    const videoId = lockup.contentId;
    const title =
      lockup.metadata?.lockupMetadataViewModel?.title?.content;

    if (videoId && title && !seen.has(videoId)) {
      seen.add(videoId);
      videos.push({
        title,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        videoId,
      });
    }
  }

  return videos;
}

async function getAllChannelVideos(): Promise<VideoEntry[]> {
  console.log("Fetching YouTube channel page...");
  const html = await fetchChannelPage();
  console.log("Extracting video data...");
  const videos = extractVideosFromPage(html);
  console.log(`Found ${videos.length} videos on channel.`);
  return videos;
}

// --- Catalogue Loader ---

function getExistingIds(): Set<string> {
  const raw = fs.readFileSync(LINKS_JSON_PATH, "utf-8");
  const linksData: LinksData[] = JSON.parse(raw);
  const ids = new Set<string>();

  for (const data of linksData) {
    for (const level of Object.values(data.levels)) {
      for (const v of level) {
        const match = v.url.match(YOUTUBE_ID_REGEX);
        if (match && match[2].length === 11) {
          ids.add(match[2]);
        }
      }
    }
    for (const v of data.motivation_and_soft_advice) {
      const match = v.url.match(YOUTUBE_ID_REGEX);
      if (match && match[2].length === 11) {
        ids.add(match[2]);
      }
    }
  }

  return ids;
}

function filterNewVideos(
  allChannelVideos: VideoEntry[],
  existingIds: Set<string>
): VideoEntry[] {
  return allChannelVideos.filter((v) => !existingIds.has(v.videoId));
}

// --- OpenRouter Classifier ---

function buildClassificationPrompt(videos: VideoEntry[]): string {
  const titles = videos.map((v, i) => `${i + 1}. ${v.title}`).join("\n");

  return `You are an expert at classifying educational YouTube videos for a system design learning platform.

Classify each of the following video titles into EXACTLY one of these four categories:
- "beginner" — introductory concepts, "what is", basics, fundamentals, simple explanations
- "intermediate" — moderate depth, how things work, patterns, practical implementations
- "advanced" — deep dives, internals, complex distributed systems, scaling, optimization
- "motivational" — career advice, interviews, soft skills, personal growth, mindset, journey stories

Here are the video titles:
${titles}

Return ONLY a valid JSON array of objects with this exact structure, nothing else:
[
  {"title": "exact video title", "classification": "category"},
  ...
]

Rules:
- The "title" field must match the input title exactly
- The "classification" must be one of: "beginner", "intermediate", "advanced", "motivational"
- Do not include any text before or after the JSON array
- Do not include markdown code blocks like \`\`\`json`;
}

async function classifyVideos(
  videos: VideoEntry[]
): Promise<ClassificationResult[]> {
  if (!OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY environment variable is not set. Create a .env.local file with your API key."
    );
  }

  console.log(
    `Classifying ${videos.length} new videos via OpenRouter (${OPENROUTER_MODEL})...`
  );

  const prompt = buildClassificationPrompt(videos);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://github.com/user/sys-design",
      "X-Title": "Arpit Bhayani Learning Hub",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `OpenRouter API error: ${response.status} ${response.statusText} — ${errorText}`
    );
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenRouter returned empty response");
  }

  let cleaned = content.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\n?/, "").replace(/\n?```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\n?/, "").replace(/\n?```$/, "");
  }

  const results: ClassificationResult[] = JSON.parse(cleaned);

  if (!Array.isArray(results) || results.length !== videos.length) {
    throw new Error(
      `Expected ${videos.length} classification results, got ${results.length}`
    );
  }

  console.log(`Successfully classified ${results.length} videos.`);
  return results;
}

// --- Catalogue Updater ---

function updateCatalogue(
  classified: ClassificationResult[],
  newVideos: VideoEntry[]
): void {
  const raw = fs.readFileSync(LINKS_JSON_PATH, "utf-8");
  const linksData: LinksData[] = JSON.parse(raw);
  const data = linksData[0];

  const summary: Record<string, number> = {
    beginner: 0,
    intermediate: 0,
    advanced: 0,
    motivational: 0,
  };

  for (const item of classified) {
    const video = newVideos.find((v) => v.title === item.title);
    if (!video) {
      console.warn(`Warning: Could not find video entry for "${item.title}", skipping.`);
      continue;
    }

    const entry = { title: item.title, url: video.url };

    switch (item.classification) {
      case "beginner":
        data.levels.beginner.push(entry);
        summary.beginner++;
        break;
      case "intermediate":
        data.levels.intermediate.push(entry);
        summary.intermediate++;
        break;
      case "advanced":
        data.levels.advanced.push(entry);
        summary.advanced++;
        break;
      case "motivational":
        data.motivation_and_soft_advice.push(entry);
        summary.motivational++;
        break;
    }
  }

  fs.writeFileSync(LINKS_JSON_PATH, JSON.stringify(linksData, null, 4) + "\n", "utf-8");

  console.log("\nCatalogue updated successfully!");
  console.log("New videos added:");
  for (const [category, count] of Object.entries(summary)) {
    if (count > 0) {
      console.log(`  ${category}: +${count}`);
    }
  }
}

// --- Main ---

async function main() {
  console.log("=== Arpit Bhayani Learning Hub — Catalogue Sync ===\n");

  try {
    const allChannelVideos = await getAllChannelVideos();
    const existingIds = getExistingIds();
    const newVideos = filterNewVideos(allChannelVideos, existingIds);

    if (newVideos.length === 0) {
      console.log("\nNo new videos found. Catalogue is up to date.");
      return;
    }

    console.log(`\nFound ${newVideos.length} new videos to classify:\n`);
    for (const v of newVideos) {
      console.log(`  - ${v.title}`);
    }

    console.log("");
    const classified = await classifyVideos(newVideos);

    console.log("\nClassification results:");
    for (const c of classified) {
      console.log(`  [${c.classification}] ${c.title}`);
    }

    updateCatalogue(classified, newVideos);

    console.log("\nDone!");
  } catch (error) {
    console.error("\nError:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
