import { Video, LinksData, DifficultyLevel, ContentType, Series, SeriesMembership } from "@/types";
import rawLinks from "@/data/links.json";
import rawSeries from "@/data/series.json";

const linksData = (rawLinks as unknown) as LinksData[];
const seriesData = (rawSeries as unknown) as Series[];

export const getYouTubeId = (url: string): string | undefined => {
    // Robust parse via URL API: handles watch?v=, youtu.be/, /shorts/, /embed/,
    // /live/, /v/ plus extra params (?t=, ?si=, &list=, ...).
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace(/^(www\.|m\.)/, "");
        const v = parsed.searchParams.get("v");
        if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
        const pathMatch =
            parsed.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/?#&]+)/) ||
            (host === "youtu.be" ? parsed.pathname.match(/^\/([^/?#&]+)/) : null);
        const id = pathMatch?.[1];
        if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) return id;
    } catch {
        // Not a valid absolute URL — fall through to regex below.
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|live\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : undefined;
};

export const getAllVideos = (): Video[] => {
    const videos: Video[] = [];

    linksData.forEach((data) => {
        // Technical Levels
        if (data.levels) {
            Object.values(data.levels).forEach((list: Video[]) => {
                list.forEach((v: Video) => {
                    videos.push({
                        ...v,
                        videoId: getYouTubeId(v.url),
                        id: getYouTubeId(v.url)
                    });
                });
            });
        }

        // Motivational
        if (data.motivation_and_soft_advice) {
            data.motivation_and_soft_advice.forEach((v: Video) => {
                videos.push({
                    ...v,
                    videoId: getYouTubeId(v.url),
                    id: getYouTubeId(v.url)
                });
            });
        }
    });

    return videos;
};

export const getVideoById = (id: string): Video | undefined => {
    const allVideos = getAllVideos();
    return allVideos.find(v => v.id === id);
}

export const getVideosByCategory = (type: ContentType, level?: DifficultyLevel): Video[] => {
    const videos: Video[] = [];

    linksData.forEach(data => {
        if (type === 'technical' && data.levels) {
            if (level && data.levels[level]) {
                videos.push(...data.levels[level].map((v: Video) => ({ ...v, videoId: getYouTubeId(v.url), id: getYouTubeId(v.url) })));
            } else if (!level) {
                // All technical levels
                Object.values(data.levels).forEach((list: Video[]) => {
                    videos.push(...list.map((v: Video) => ({ ...v, videoId: getYouTubeId(v.url), id: getYouTubeId(v.url) })));
                })
            }
        }
        else if (type === 'motivational') {
            // Ignores level for motivational now as it is a flat list
            if (data.motivation_and_soft_advice) {
                videos.push(...data.motivation_and_soft_advice.map((v: Video) => ({ ...v, videoId: getYouTubeId(v.url), id: getYouTubeId(v.url) })));
            }
        }
    });
    return videos;
}
export const searchVideos = (query: string): Video[] => {
    const allVideos = getAllVideos();
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) return [];

    return allVideos.filter(video => {
        const titleMatch = video.title.toLowerCase().includes(normalizedQuery);
        // We can add more fields to search here if available (e.g. tags, description)
        return titleMatch;
    });
};

export const getCommonTags = (limit: number = 10): string[] => {    const allVideos = getAllVideos();
    const wordCounts: Record<string, number> = {};
    const stopWords = new Set([
        // Common Prepositions & Articles
        'and', 'the', 'to', 'of', 'in', 'a', 'an', 'for', 'with', 'on', 'at', 'from', 'by',
        'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against',
        'during', 'without', 'before', 'under', 'around', 'among',

        // Common Verbs & Auxiliaries
        'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
        'did', 'can', 'could', 'shall', 'should', 'will', 'would', 'may', 'might', 'must',
        'using', 'use', 'uses', 'used', 'make', 'making', 'build', 'building', 'create', 'creating',
        'implement', 'implementing', 'getting', 'get', 'know', 'knowing', 'need', 'needed',
        'learn', 'learning', 'decide', 'deciding', 'start', 'starting', 'stop', 'stopping',
        'dissecting', 'structure', 'understanding', 'understand', 'explained', 'explaining',

        // Pronouns & Common Connectors
        'it', 'its', 'they', 'their', 'them', 'we', 'our', 'us', 'you', 'your', 'my', 'me',
        'that', 'this', 'these', 'those', 'which', 'who', 'what', 'where', 'when', 'why', 'how',
        'or', 'but', 'not', 'if', 'so', 'then', 'else', 'than', 'just', 'only', 'also', 'even',

        // Filler/Content Type Words (Noise)
        'video', 'videos', 'full', 'course', 'tutorial', 'guide', 'series', 'part', 'episode', 'ep',
        'intro', 'introduction', 'overview', 'deep', 'dive', 'deep-dive', 'paper', 'interview',
        'best', 'worst', 'better', 'practices', 'vs', 'versus', 'difference', 'master', 'mastering',
        'zero', 'hero', 'scratch', 'advanced', 'beginner', 'intermediate', 'complete', 'roadmap',

        // Specific Generic Terms (Context-specific noise)
        'type', 'types', 'data', 'system', 'systems', 'code', 'real', 'world', 'application', 'apps',
        'software', 'engineer', 'engineering', 'developer', 'development', 'tech', 'technology',
        'things', 'everything', 'something', 'anything', 'nothing', 'problem', 'solution', 'way', 'ways'
    ]);

    allVideos.forEach(video => {
        // Clean title: remove special chars, lowercase
        const cleanTitle = video.title.toLowerCase().replace(/[^\w\s]/g, '');
        const words = cleanTitle.split(/\s+/);

        words.forEach(word => {
            if (word.length > 2 && !stopWords.has(word) && !/^\d+$/.test(word)) {
                wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
        });
    });

    // Convert to array and sort by count
    return Object.entries(wordCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1)); // Capitalize
};

// ---------------------------------------------------------------------------
// Series (cross-cutting ordered groups like Redis Internals; independent of level)
// ---------------------------------------------------------------------------

export const getAllSeries = (): Series[] => seriesData;

export const getSeriesBySlug = (slug: string): Series | undefined =>
    seriesData.find((s) => s.slug === slug);

export const getSeriesVideos = (slug: string): Video[] => {
    const series = getSeriesBySlug(slug);
    if (!series) return [];
    return series.videoIds
        .map((id) => getVideoById(id))
        .filter((v): v is Video => Boolean(v));
};

const videoToSeriesSlug = new Map<string, string>();
seriesData.forEach((s) =>
    s.videoIds.forEach((id) => {
        if (!videoToSeriesSlug.has(id)) videoToSeriesSlug.set(id, s.slug);
    })
);

export const getSeriesForVideo = (videoId: string): SeriesMembership | undefined => {
    const slug = videoToSeriesSlug.get(videoId);
    if (!slug) return undefined;
    const series = getSeriesBySlug(slug);
    if (!series) return undefined;
    const index = series.videoIds.indexOf(videoId);
    if (index === -1) return undefined;
    const videos = getSeriesVideos(slug);
    return {
        series,
        part: index + 1,
        total: series.videoIds.length,
        prev: index > 0 ? videos[index - 1] : undefined,
        next: index < videos.length - 1 ? videos[index + 1] : undefined,
    };
};
