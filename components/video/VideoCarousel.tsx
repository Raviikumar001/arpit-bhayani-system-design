"use client";

import { useRef } from "react";
import { Video } from "@/types";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoCarouselProps {
    title: string;
    videos: Video[];
    viewAllLink?: string;
}

export function VideoCarousel({ title, videos, viewAllLink }: VideoCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === "left" ? -300 : 300;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    if (!videos.length) return null;

    return (
        <section className="py-6 space-y-4">
            <div className="flex items-center justify-between px-6 md:px-12">
                <h2 className="text-xl md:text-2xl font-bold text-white group cursor-pointer flex items-center gap-2">
                    {title}
                    <span className="hidden group-hover:block text-xs text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore &rarr;
                    </span>
                </h2>
                {viewAllLink && (
                    <Link href={viewAllLink} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        View All
                    </Link>
                )}
            </div>

            <div className="group relative">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-r from-black to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-8 h-8 text-white hover:scale-110 transition-transform" />
                </button>

                {/* Carousel Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto px-6 md:px-12 pb-4 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {videos.map((video, index) => (
                        <Link
                            key={`${video.id}-${index}`}
                            href={`/video/${video.id}`}
                            className="flex-none w-[280px] md:w-[320px] snap-start group/card"
                        >
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900 border border-white/5 transition-transform duration-300 group-hover/card:scale-105 group-hover/card:border-white/20 ring-offset-black">
                                {video.videoId && (
                                    <img
                                        src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                                </div>
                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-[10px] font-bold rounded backdrop-blur-md">
                                    VIDEO
                                </div>
                            </div>
                            <div className="mt-3">
                                <h3 className="text-zinc-100 font-medium text-sm md:text-base line-clamp-2 leading-snug group-hover/card:text-blue-400 transition-colors">
                                    {video.title}
                                </h3>
                                <p className="text-zinc-500 text-xs mt-1 line-clamp-1">{video.focus || "Education"}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-l from-black to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-8 h-8 text-white hover:scale-110 transition-transform" />
                </button>
            </div>
        </section>
    );
}
