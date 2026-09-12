import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVideosByCategory } from "@/lib/video-utils";
import { CategoryBrowser } from "@/components/category/CategoryBrowser";
import { ContentType, DifficultyLevel } from "@/types";

// Static export: only these category combos exist; anything else is a CDN 404.
export const dynamicParams = false;

const VALID_CATEGORIES = [
    { type: "technical", level: "beginner" },
    { type: "technical", level: "intermediate" },
    { type: "technical", level: "advanced" },
    { type: "motivational", level: "all" },
] as const;

export function generateStaticParams() {
    return VALID_CATEGORIES.map(({ type, level }) => ({ type, level }));
}

function categoryTitle(type: string, level: string): string {
    if (type === "motivational") return "Motivation & Advice";
    return `${level.charAt(0).toUpperCase() + level.slice(1)} Concepts`;
}

export async function generateMetadata(
    { params }: { params: Promise<{ type: string; level: string }> }
): Promise<Metadata> {
    const { type, level } = await params;
    const title = categoryTitle(type, level);
    return {
        title,
        description: type === "motivational"
            ? "Career guidance, soft skills, and engineering philosophy from Arpit Bhayani."
            : `Curated ${level} system design videos for the ${type} learning path.`,
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ type: string; level: string }> }) {
    const { type, level } = await params;

    const isValid = VALID_CATEGORIES.some((c) => c.type === type && c.level === level);
    if (!isValid) {
        notFound();
    }

    const videoType = type as ContentType;
    const videoLevel = level === 'all' ? undefined : (level as DifficultyLevel);
    const videos = getVideosByCategory(videoType, videoLevel);

    return <CategoryBrowser type={type} level={level} videos={videos} />;
}
