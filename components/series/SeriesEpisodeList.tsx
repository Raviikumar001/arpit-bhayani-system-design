"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { Video } from "@/types";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

interface SeriesEpisodeListProps {
    videos: Video[];
}

export function SeriesEpisodeList({ videos }: SeriesEpisodeListProps) {
    const { progress } = useStore();

    return (
        <ol className="space-y-2">
            {videos.map((video, index) => {
                const isCompleted = video.id ? progress[video.id]?.completed : false;
                return (
                    <li key={video.id || `${video.url}-${index}`}>
                        <Link
                            href={`/video/${video.id}`}
                            className="group flex items-center gap-3 md:gap-4 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/15 transition-all duration-200"
                        >
                            <span className="w-8 shrink-0 text-center font-mono text-sm font-bold text-zinc-600 group-hover:text-blue-400 transition-colors">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="relative w-24 md:w-40 shrink-0 aspect-video rounded-lg overflow-hidden bg-black/50 border border-white/5">
                                {video.videoId ? (
                                    <Image
                                        src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                                        alt={video.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 96px, 160px"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-zinc-600 text-xs">
                                        No thumbnail
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={cn(
                                    "font-medium text-sm md:text-base leading-snug line-clamp-2 transition-colors",
                                    isCompleted ? "text-zinc-400" : "text-zinc-100 group-hover:text-white"
                                )}>
                                    {video.title}
                                </h3>
                            </div>
                            {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                            ) : (
                                <Circle className="w-5 h-5 text-zinc-700 group-hover:text-zinc-500 shrink-0 transition-colors" />
                            )}
                            <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-300 group-hover:translate-x-0.5 shrink-0 transition-all" />
                        </Link>
                    </li>
                );
            })}
        </ol>
    );
}
