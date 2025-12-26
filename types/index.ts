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
