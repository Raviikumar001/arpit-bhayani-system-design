"use client";

import { use, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw } from "lucide-react";
import { getSeriesBySlug, getSeriesVideos } from "@/lib/video-utils";
import { SeriesEpisodeList } from "@/components/series/SeriesEpisodeList";
import { useStore } from "@/store/useStore";

export default function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { progress, loadData } = useStore();

    useEffect(() => {
        loadData();
    }, [loadData]);

    const series = getSeriesBySlug(slug);
    const videos = useMemo(() => getSeriesVideos(slug), [slug]);

    if (!series) {
        return (
            <div className="p-8 max-w-7xl mx-auto text-center py-20">
                <h1 className="text-2xl font-bold text-white mb-2">Series not found</h1>
                <p className="text-zinc-400 mb-6">This series does not exist.</p>
                <Link href="/series" className="text-blue-400 hover:text-blue-300 font-medium">
                    &larr; Back to all series
                </Link>
            </div>
        );
    }

    const completed = videos.filter((v) => v.id && progress[v.id]?.completed).length;
    const total = videos.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const nextUp = videos.find((v) => v.id && !progress[v.id]?.completed);
    const isFinished = total > 0 && completed === total;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <Link
                href="/series"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                All series
            </Link>

            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded border border-blue-500/30 uppercase tracking-wider">
                        Series
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">
                        {total} episode{total === 1 ? "" : "s"}
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {series.title}
                </h1>
                <p className="text-zinc-400 mb-6 max-w-2xl">
                    {series.tagline}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {nextUp || isFinished ? (
                        <Link
                            href={`/video/${isFinished ? videos[0]?.id : nextUp?.id}`}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-colors"
                        >
                            {isFinished ? (
                                <>
                                    <RotateCcw className="w-4 h-4" />
                                    Watch Again
                                </>
                            ) : completed > 0 ? (
                                <>
                                    <Play className="w-4 h-4 fill-black" />
                                    Continue Watching
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 fill-black" />
                                    Start Series
                                </>
                            )}
                        </Link>
                    ) : null}
                    <div className="flex-1 min-w-48">
                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <p className="mt-1.5 text-xs text-zinc-500 font-medium">
                            {completed}/{total} watched ({pct}%)
                        </p>
                    </div>
                </div>
            </div>

            <h2 className="text-lg font-bold text-white mb-4">Episodes</h2>
            <SeriesEpisodeList videos={videos} />
        </div>
    );
}
