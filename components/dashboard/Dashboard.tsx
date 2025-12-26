"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { getAllVideos, getVideoById } from "@/lib/video-utils";
import { Video } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { VideoCard } from "@/components/video/VideoCard";
import { PlayCircle, Award, BookOpen } from "lucide-react";
import Link from "next/link";
import { VideoGrid } from "@/components/video/VideoGrid";

export function Dashboard() {
    const { progress, loadData } = useStore();
    const [lastWatchedVideo, setLastWatchedVideo] = useState<Video | undefined>(undefined);
    const [randomRecommendations, setRandomRecommendations] = useState<Video[]>([]);
    const [stats, setStats] = useState({ completed: 0, total: 0 });

    useEffect(() => {
        loadData();
        // Calculate stats and find last watched
        const videos = getAllVideos();
        setStats({
            completed: Object.values(progress).filter(p => p.completed).length,
            total: videos.length
        });

        // Find last watched (most recent timestamp)
        const watched = Object.values(progress).sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
        if (watched.length > 0) {
            setLastWatchedVideo(getVideoById(watched[0].videoId));
        }

        // Random recommendations (naive approach for now)
        setRandomRecommendations(videos.slice(0, 4));

    }, [progress, loadData]);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header / Stats */}
            <GlassCard className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        Welcome back!
                    </h1>
                    <p className="text-zinc-400 mt-2">
                        You have completed <span className="text-white font-bold">{stats.completed}</span> out of <span className="text-white font-bold">{stats.total}</span> videos.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-center bg-white/5 p-4 rounded-xl backdrop-blur-md">
                        <Award className="w-6 h-6 text-yellow-500 mb-1" />
                        <span className="text-2xl font-bold">{Math.round((stats.completed / (stats.total || 1)) * 100)}%</span>
                        <span className="text-xs text-zinc-500">COMPLETED</span>
                    </div>
                    <div className="flex flex-col items-center bg-white/5 p-4 rounded-xl backdrop-blur-md">
                        <BookOpen className="w-6 h-6 text-blue-500 mb-1" />
                        <span className="text-2xl font-bold">{stats.total}</span>
                        <span className="text-xs text-zinc-500">TOTAL VIDEOS</span>
                    </div>
                </div>
            </GlassCard>

            {/* Resume Watching */}
            {lastWatchedVideo && (
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <PlayCircle className="w-5 h-5 text-blue-400" />
                        <h2 className="text-xl font-bold text-zinc-200">Resume Learning</h2>
                    </div>
                    <GlassCard hoverEffect className="p-0 max-w-2xl group">
                        <Link href={`/video/${lastWatchedVideo.id}`} className="flex flex-col md:flex-row gap-4 p-4 items-center">
                            <div className="relative w-full md:w-48 aspect-video rounded-lg overflow-hidden bg-zinc-800">
                                {lastWatchedVideo.videoId && (
                                    <img
                                        src={`https://img.youtube.com/vi/${lastWatchedVideo.videoId}/mqdefault.jpg`}
                                        alt={lastWatchedVideo.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{lastWatchedVideo.title}</h3>
                                <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{lastWatchedVideo.focus}</p>
                                <div className="mt-3 text-xs text-blue-400 font-medium">Continue watching &rarr;</div>
                            </div>
                        </Link>
                    </GlassCard>
                </section>
            )}

            {/* Recommendations / Start */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xl font-bold text-zinc-200">Recommended for you</h2>
                </div>
                <VideoGrid videos={randomRecommendations} />
            </section>
        </div>
    );
}
