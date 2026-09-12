import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VideoDetail } from "@/components/video/VideoDetail";
import { getAllVideos, getVideoById } from "@/lib/video-utils";

// Static export: only pre-rendered IDs exist; anything else is a CDN-level 404.
export const dynamicParams = false;

export function generateStaticParams() {
    const seen = new Set<string>();
    const params: { id: string }[] = [];
    for (const video of getAllVideos()) {
        if (video.id && !seen.has(video.id)) {
            seen.add(video.id);
            params.push({ id: video.id });
        }
    }
    return params;
}

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
    const { id } = await params;
    const video = getVideoById(id);
    if (!video) return { title: "Video not found" };
    const thumbnail = video.videoId
        ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
        : undefined;
    return {
        title: video.title,
        description: `Watch "${video.title}" by Arpit Bhayani — track progress and take notes.`,
        openGraph: thumbnail
            ? { title: video.title, images: [thumbnail] }
            : { title: video.title },
    };
}

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const video = getVideoById(id);

    if (!video) {
        notFound();
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <VideoDetail video={video} />
        </div>
    );
}
