import { VideoDetail } from "@/components/video/VideoDetail";
import { getVideoById } from "@/lib/video-utils";
import { use } from "react";

export default function VideoPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const video = getVideoById(resolvedParams.id);

    if (!video) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <h1 className="text-2xl font-bold text-zinc-500">Video not found: {resolvedParams.id}</h1>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <VideoDetail video={video} />
        </div>
    );
}
