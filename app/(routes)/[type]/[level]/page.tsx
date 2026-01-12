"use client";

import { useParams } from "next/navigation";
import { getVideosByCategory } from "@/lib/video-utils";
import { VideoGrid } from "@/components/video/VideoGrid";
import { GlassCard } from "@/components/ui/GlassCard";
import { DifficultyLevel, ContentType } from "@/types";
import { use, useState } from "react";
import { Search } from "lucide-react";

export default function CategoryPage({ params }: { params: Promise<{ type: string; level: string }> }) {
    const resolvedParams = use(params);
    const { type, level } = resolvedParams;

    const [filterQuery, setFilterQuery] = useState("");

    const videoType = type as ContentType;

    const videoLevel = level === 'all' ? undefined : (level as DifficultyLevel);

    const initialVideos = getVideosByCategory(videoType, videoLevel);

    const filteredVideos = initialVideos.filter(video =>
        video.title.toLowerCase().includes(filterQuery.toLowerCase())
    );

    const title = videoType === 'motivational' ? "Motivation & Advice" : `${level} Concepts`;
    const description = videoType === 'motivational'
        ? "Career guidance, soft skills, and engineering philosophy."
        : `Curated list of ${level} videos for ${type} path.`;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
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

                    {/* Level Switcher (Tabs) for Technical Content */}
                    {type === 'technical' && (
                        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                            {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                                <a
                                    key={lvl}
                                    href={`/technical/${lvl}`}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${level === lvl
                                            ? 'bg-white text-black'
                                            : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative w-full md:w-72 group">
                    <div className="relative flex items-center bg-zinc-900/50 rounded-xl border border-white/10 focus-within:border-white/25 focus-within:bg-zinc-800/70 backdrop-blur-xl transition-all duration-300 shadow-lg">
                        <Search className="w-4 h-4 text-zinc-500 ml-3" />
                        <input
                            type="text"
                            placeholder="Filter videos..."
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 text-sm text-white px-3 py-2.5 placeholder:text-zinc-600 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {filteredVideos.length > 0 ? (
                <VideoGrid videos={filteredVideos} />
            ) : (
                <div className="text-center py-20 opacity-50">
                    <p>No videos found matching "{filterQuery}"</p>
                </div>
            )}
        </div>
    );
}
