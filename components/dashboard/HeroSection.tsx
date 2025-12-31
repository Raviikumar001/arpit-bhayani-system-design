import { Video } from "@/types";
import { Play, Info } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
    video: Video;
}

export function HeroSection({ video }: HeroSectionProps) {
    if (!video) return null;

    return (
        <section className="relative w-full h-[60vh] md:h-[70vh] flex items-end">
            {/* Background Image */}
            <div className="absolute inset-0">
                {video.videoId && (
                    <img
                        src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 md:p-12 max-w-4xl w-full ml-2">
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded border border-yellow-500/30 uppercase tracking-wider">
                        Featured
                    </span>
                    {video.focus && (
                        <span className="px-2 py-1 bg-white/10 text-zinc-300 text-xs font-medium rounded backdrop-blur-md">
                            {video.focus}
                        </span>
                    )}
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-xl line-clamp-2">
                    {video.title}
                </h1>

                <p className="text-zinc-300 text-sm md:text-lg mb-8 line-clamp-2 max-w-2xl drop-shadow-md">
                    {video.url ? "Watch this essential video to level up your system design skills." : "Start your learning journey with this curated content."}
                </p>

                <div className="flex items-center gap-4">
                    <Link
                        href={`/video/${video.id}`}
                        className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-zinc-200 transition-colors"
                    >
                        <Play className="w-5 h-5 fill-black" />
                        Watch Now
                    </Link>
                    {/* <button className="flex items-center gap-2 px-8 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 backdrop-blur-md transition-colors">
                        <Info className="w-5 h-5" />
                        More Info
                    </button> */}
                </div>
            </div>
        </section>
    );
}
