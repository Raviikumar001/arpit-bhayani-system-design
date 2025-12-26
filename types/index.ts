export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type ContentType = "technical" | "motivational";

export interface Video {
    title: string;
    url: string; // YouTube URL
    focus: string; // Brief description or focus area
    id?: string; // Derived from URL or index
    videoId?: string; // Extracted YouTube ID
}

export interface CategoryData {
    [key: string]: Video[]; // e.g. "beginner": [Video, Video]
}

export interface TechnicalCategories {
    beginner: Video[];
    intermediate: Video[];
    advanced: Video[];
}

export interface MotivationalCategories {
    beginner: Video[]; // Using 'beginner' as a catch-all for motivational if structure matches, or specific keys if different
    intermediate?: Video[];
}

export interface LinksData {
    channel: string;
    categories: {
        technical: TechnicalCategories;
        motivational: MotivationalCategories;
    };
}

export interface CourseData {
    channel: string;
    categories: {
        technical: {
            beginner: Video[];
            intermediate: Video[];
            advanced: Video[];
        };
        motivational: {
            beginner: Video[];
            intermediate?: Video[];
        };
    };
}


export interface Note {
    id: string;
    videoId: string;
    content: string; // Rich text or HTML
    createdAt: number;
    updatedAt: number;
}

export interface Progress {
    videoId: string;
    completed: boolean;
    lastWatchedAt?: number;
}
