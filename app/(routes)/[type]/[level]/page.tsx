"use client";

import { useParams } from "next/navigation";
import { getVideosByCategory } from "@/lib/video-utils";
import { VideoGrid } from "@/components/video/VideoGrid";
import { GlassCard } from "@/components/ui/GlassCard";
import { DifficultyLevel, ContentType } from "@/types";
import { use } from "react";

export default function CategoryPage({ params }: { params: Promise<{ type: string; level: string }> }) {
    const resolvedParams = use(params);
    const { type, level } = resolvedParams;

    const videoType = type as ContentType;
    // If logical level is "all" or strictly for motivational, we might ignore valid casting for display text
    const videoLevel = level === 'all' ? undefined : (level as DifficultyLevel);

    const videos = getVideosByCategory(videoType, videoLevel);

    const title = videoType === 'motivational' ? "Motivation & Advice" : `${level} Concepts`;
    const description = videoType === 'motivational'
        ? "Career guidance, soft skills, and engineering philosophy."
        : `Curated list of ${level} videos for ${type} path.`;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <GlassCard className="inline-block p-4 px-6 bg-white/5 border-white/10 mb-4 rounded-full">
                    <span className="capitalize text-zinc-400">{type}</span>
                    {level !== 'all' && (
                        <>
                            <span className="mx-2 text-zinc-600">/</span>
                            <span className="capitalize text-white font-bold">{level}</span>
                        </>
                    )}
                </GlassCard>
                <h1 className="text-3xl font-bold text-white mb-2 capitalize">
                    {title}
                </h1>
                <p className="text-zinc-400">
                    {description}
                </p>
            </div>

            <VideoGrid videos={videos} />
        </div>
    );
}
