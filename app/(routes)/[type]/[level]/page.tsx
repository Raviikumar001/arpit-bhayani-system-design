"use client";

import { useParams } from "next/navigation"; // Correct hook for client components
import { getVideosByCategory } from "@/lib/video-utils";
import { VideoGrid } from "@/components/video/VideoGrid";
import { GlassCard } from "@/components/ui/GlassCard";
import { DifficultyLevel, ContentType } from "@/types";
import { use } from "react";

// For dynamic routes in App Router with params
export default function CategoryPage({ params }: { params: Promise<{ type: string; level: string }> }) {
    const resolvedParams = use(params);
    const { type, level } = resolvedParams;

    // Basic validation/casting
    const videoType = type as ContentType;
    const videoLevel = level as DifficultyLevel;

    const videos = getVideosByCategory(videoType, videoLevel);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <GlassCard className="inline-block p-4 px-6 bg-white/5 border-white/10 mb-4 rounded-full">
                    <span className="capitalize text-zinc-400">{type}</span>
                    <span className="mx-2 text-zinc-600">/</span>
                    <span className="capitalize text-white font-bold">{level}</span>
                </GlassCard>
                <h1 className="text-3xl font-bold text-white mb-2 capitalize">
                    {level} Concepts
                </h1>
                <p className="text-zinc-400">
                    Curated list of {videoLevel} videos for {videoType} path.
                </p>
            </div>

            <VideoGrid videos={videos} />
        </div>
    );
}
