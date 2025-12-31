import { Video, LinksData, DifficultyLevel, ContentType } from "@/types";
import rawLinks from "@/data/links.json";

const linksData = (rawLinks as unknown) as LinksData[];

export const getYouTubeId = (url: string): string | undefined => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
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

export const getCommonTags = (limit: number = 10): string[] => {
    const allVideos = getAllVideos();
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
