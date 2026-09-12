import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllSeries, getSeriesBySlug, getSeriesVideos } from "@/lib/video-utils";
import { SeriesDetailClient } from "@/components/series/SeriesDetailClient";

// Static export: only known slugs exist; anything else is a CDN-level 404.
export const dynamicParams = false;

export function generateStaticParams() {
    return getAllSeries().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const series = getSeriesBySlug(slug);
    if (!series) return { title: "Series not found" };
    const firstVideo = getSeriesVideos(slug)[0];
    const thumbnail = firstVideo?.videoId
        ? `https://img.youtube.com/vi/${firstVideo.videoId}/hqdefault.jpg`
        : undefined;
    return {
        title: series.title,
        description: series.tagline,
        openGraph: thumbnail
            ? { title: series.title, description: series.tagline, images: [thumbnail] }
            : { title: series.title, description: series.tagline },
    };
}

export default async function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const series = getSeriesBySlug(slug);

    if (!series) {
        notFound();
    }

    const videos = getSeriesVideos(slug);

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <Link
                href="/series"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                All series
            </Link>

            <SeriesDetailClient series={series} videos={videos} />
        </div>
    );
}
