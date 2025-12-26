import { Video } from "@/types";
import { VideoCard } from "./VideoCard";

interface VideoGridProps {
    videos: Video[];
}

export function VideoGrid({ videos }: VideoGridProps) {
    if (!videos || videos.length === 0) {
        return (
            <div className="flex items-center justify-center p-12 text-zinc-500">
                No videos found.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {videos.map((video, index) => (
                <VideoCard key={`${video.id || video.url}-${index}`} video={video} />
            ))}
        </div>
    );
}
