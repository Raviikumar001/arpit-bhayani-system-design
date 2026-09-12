"use client";

import Link from "next/link";
import { ListVideo } from "lucide-react";
import { Series } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { useStore } from "@/store/useStore";

interface SeriesCardProps {
    series: Series;
}

export function SeriesCard({ series }: SeriesCardProps) {
    const { progress } = useStore();
    const total = series.videoIds.length;
    const completed = series.videoIds.filter((id) => progress[id]?.completed).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <Link href={`/series/${series.slug}`} className="block group h-full">
            <GlassCard hoverEffect className="h-full p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-blue-400">
                    <ListVideo className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                        {total} episode{total === 1 ? "" : "s"}
                    </span>
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors leading-snug">
                    {series.title}
                </h3>
                <p className="text-sm text-zinc-400 line-clamp-2 flex-1">
                    {series.tagline}
                </p>
                <div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                    <p className="mt-2 text-xs text-zinc-500 font-medium">
                        {completed}/{total} watched
                    </p>
                </div>
            </GlassCard>
        </Link>
    );
}
