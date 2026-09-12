"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { getAllVideos, getVideoById, getVideosByCategory, getAllSeries } from "@/lib/video-utils";
import { Video } from "@/types";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { VideoCarousel } from "@/components/video/VideoCarousel";
import { SeriesCard } from "@/components/series/SeriesCard";

function shuffled<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export function Dashboard() {
    const { progress, loadData } = useStore();
    const [continueWatching, setContinueWatching] = useState<Video[]>([]);
    const [featuredVideo, setFeaturedVideo] = useState<Video | undefined>(undefined);
    const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([]);
    const [motivationalVideos, setMotivationalVideos] = useState<Video[]>([]);

    useEffect(() => {
        loadData();
        const allVideos = getAllVideos();

        // Genuine random sample across the whole library (not just the first 8).
        setRecommendedVideos(shuffled(allVideos).slice(0, 8));

        // Use the curated motivational list instead of keyword-guessing titles.
        setMotivationalVideos(getVideosByCategory("motivational"));


        const randomFeatured = allVideos[Math.floor(Math.random() * allVideos.length)];
        setFeaturedVideo(randomFeatured);

    }, []);

    useEffect(() => {

        const watched = Object.values(progress).sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
        const recent = watched
            .slice(0, 10)
            .map((p) => getVideoById(p.videoId))
            .filter((v): v is Video => Boolean(v));
        setContinueWatching(recent);
    }, [progress]);

    return (
        <div className="pb-24 space-y-8">
            {/* Hero Section */}
            {featuredVideo && <HeroSection video={featuredVideo} />}

            <div className="px-0 md:px-2 space-y-8 -mt-12 relative z-20">


                {continueWatching.length > 0 && (
                    <VideoCarousel
                        title="Continue Watching"
                        videos={continueWatching}
                    />
                )}

                <VideoCarousel
                    title="Recommended for You"
                    videos={recommendedVideos}
                />

                <section className="py-6 space-y-4 px-2">
                    <div className="flex items-center justify-between px-6 md:px-12">
                        <h2 className="text-xl md:text-2xl font-bold text-white">
                            Learning Series
                        </h2>
                        <Link href="/series" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                            View All
                        </Link>
                    </div>
                    <div
                        className="flex gap-4 overflow-x-auto px-6 md:px-12 pb-4 scrollbar-hide snap-x"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {getAllSeries().map((series) => (
                            <div key={series.slug} className="flex-none w-[280px] md:w-[320px] snap-start">
                                <SeriesCard series={series} />
                            </div>
                        ))}
                    </div>
                </section>

                <VideoCarousel
                    title="Motivation & Advice"
                    videos={motivationalVideos}
                    viewAllLink="/motivational/all"
                /> 


                <VideoCarousel
                    title="Trending Now"
                    videos={recommendedVideos.slice().reverse()}
                />
            </div>
        </div>
    );
}
