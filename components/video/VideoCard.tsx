"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle, PlayCircle } from "lucide-react";
import { Video } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

interface VideoCardProps {
    video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
    const { progress } = useStore();
    const isCompleted = video.id ? progress[video.id]?.completed : false;

    return (
        <Link href={`/video/${video.id}`} className="block group">
            <GlassCard hoverEffect className="h-full flex flex-col">
                <div className="relative aspect-video w-full overflow-hidden border-b border-white/10 bg-black/50">
                    {video.videoId ? (
                        <Image
                            src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                            alt={video.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-zinc-500">
                            No Thumbnail
                        </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                        <PlayCircle className="w-12 h-12 text-white/90" />
                    </div>

                    {isCompleted && (
                        <div className="absolute top-2 right-2 bg-green-500/80 backdrop-blur-md rounded-full p-1 shadow-lg">
                            <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>

                <div className="p-4 flex flex-col flex-1 gap-2">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg text-zinc-100 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                            {video.title}
                        </h3>
                    </div>
                    {video.focus && (
                        <p className="text-sm text-zinc-400 line-clamp-2 mt-auto">
                            {video.focus}
                        </p>
                    )}
                </div>
            </GlassCard>
        </Link>
    );
}
