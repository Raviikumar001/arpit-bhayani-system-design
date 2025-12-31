"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { getAllVideos, getVideoById } from "@/lib/video-utils";
import { Video } from "@/types";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { VideoCarousel } from "@/components/video/VideoCarousel";
import { GlassCard } from "@/components/ui/GlassCard";
import { Award, BookOpen } from "lucide-react";

export function Dashboard() {
    const { progress, loadData } = useStore();
    const [lastWatchedVideo, setLastWatchedVideo] = useState<Video | undefined>(undefined);
    const [featuredVideo, setFeaturedVideo] = useState<Video | undefined>(undefined);
    const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([]);
    const [motivationalVideos, setMotivationalVideos] = useState<Video[]>([]);

    useEffect(() => {
        loadData();
        const allVideos = getAllVideos();


        setRecommendedVideos(allVideos.slice(0, 8).sort(() => 0.5 - Math.random()));

        setMotivationalVideos(allVideos.filter(v =>
            v.title.toLowerCase().includes("journey") ||
            v.title.toLowerCase().includes("life") ||
            v.title.toLowerCase().includes("career")
        ));


        const randomFeatured = allVideos[Math.floor(Math.random() * allVideos.length)];
        setFeaturedVideo(randomFeatured);

    }, []);

    useEffect(() => {

        const watched = Object.values(progress).sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
        let lastWatched: Video | undefined;
        if (watched.length > 0) {
            lastWatched = getVideoById(watched[0].videoId);
            setLastWatchedVideo(lastWatched);

        }
    }, [progress]);

    return (
        <div className="pb-24 space-y-8">
            {/* Hero Section */}
            {featuredVideo && <HeroSection video={featuredVideo} />}

            <div className="px-0 md:px-2 space-y-8 -mt-12 relative z-20">


                {lastWatchedVideo && (
                    <VideoCarousel
                        title="Continue Watching"
                        videos={[lastWatchedVideo]}
                    />
                )}


                <VideoCarousel
                    title="Recommended for You"
                    videos={recommendedVideos}
                />


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
