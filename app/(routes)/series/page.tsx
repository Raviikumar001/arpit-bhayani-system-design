"use client";

import { useEffect } from "react";
import { getAllSeries } from "@/lib/video-utils";
import { SeriesCard } from "@/components/series/SeriesCard";
import { useStore } from "@/store/useStore";

export default function SeriesIndexPage() {
    const { loadData } = useStore();

    useEffect(() => {
        loadData();
    }, [loadData]);

    const allSeries = getAllSeries();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Learning Series
                </h1>
                <p className="text-zinc-400">
                    Ordered multi-part series — watch them start to finish.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allSeries.map((series) => (
                    <SeriesCard key={series.slug} series={series} />
                ))}
            </div>
        </div>
    );
}
