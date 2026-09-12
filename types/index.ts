export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type ContentType = "technical" | "motivational";

export interface Video {
    title: string;
    url: string; // YouTube URL
    focus?: string; // Optional now based on new data
    id?: string; // Derived from URL or index
    videoId?: string; // Extracted YouTube ID
}

export interface Levels {
    beginner: Video[];
    intermediate: Video[];
    advanced: Video[];
}

export interface LinksData {
    levels: Levels;
    motivation_and_soft_advice: Video[];
}

export interface Series {
    slug: string;
    title: string;
    tagline: string;
    videoIds: string[]; // Ordered episode list (YouTube IDs)
}

export interface SeriesMembership {
    series: Series;
    part: number; // 1-based episode number
    total: number;
    prev?: Video;
    next?: Video;
}

// Keeping Note and Progress as they are independent of static data structure
export interface Note {
    id: string;
    videoId: string;
    content: string;
    createdAt: number;
    updatedAt: number;
}

export interface Progress {
    videoId: string;
    completed: boolean;
    lastWatchedAt?: number;
}
