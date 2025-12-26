"use client";

import { useEffect, useState, useRef } from "react";
import { useStore } from "@/store/useStore";
import { Video } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoDetailProps {
    video: Video;
}

export function VideoDetail({ video }: VideoDetailProps) {
    const { progress, notes, markCompleted, saveNote, loadData, updateProgress } = useStore();
    const [noteContent, setNoteContent] = useState("");
    const isVideoCompleted = video.id ? progress[video.id]?.completed : false;

    // Use a ref to track if we've loaded data to prevent overwriting note state on initial render
    const dataLoaded = useRef(false);

    useEffect(() => {
        loadData().then(() => {
            dataLoaded.current = true;
            if (video.id && notes[video.id]) {
                setNoteContent(notes[video.id].content);
            }
        });
    }, [loadData, video.id]); // Removed notes from dependency to avoid infinite loop or reset if not careful

    // Sync note content from store only on first load logic (simulated above) or when switching videos
    useEffect(() => {
        if (video.id && notes[video.id]) {
            setNoteContent(notes[video.id].content);
        } else {
            setNoteContent("");
        }
    }, [video.id, notes]); // This might need refinement to avoid overwriting user typing if store updates elsewhere

    const handleToggleComplete = () => {
        if (video.id) {
            markCompleted(video.id, !isVideoCompleted);
        }
    };

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNoteContent(e.target.value);
    };

    const handleNoteBlur = () => {
        if (video.id) {
            saveNote(video.id, noteContent);
        }
    };

    // Auto-mark watched when playing (simplified simulation: just update last watched on mount)
    useEffect(() => {
        if (video.id) {
            updateProgress(video.id, Date.now());
        }
    }, [video.id, updateProgress]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player Section */}
            <div className="lg:col-span-2 space-y-6">
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
                    {video.videoId ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${video.videoId}`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-zinc-500">Video not available</div>
                    )}
                </div>

                <GlassCard className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-zinc-400">
                                {video.focus && (
                                    <span className="bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                        {video.focus}
                                    </span>
                                )}
                                {/* Fake duration or meta if available */}
                            </div>
                        </div>

                        <button
                            onClick={handleToggleComplete}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300",
                                isVideoCompleted
                                    ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                                    : "bg-white/10 text-zinc-300 hover:bg-white/20"
                            )}
                        >
                            <CheckCircle className={cn("w-5 h-5", isVideoCompleted && "fill-current")} />
                            {isVideoCompleted ? "Completed" : "Mark Complete"}
                        </button>
                    </div>
                </GlassCard>
            </div>

            {/* Notes Section */}
            <div className="lg:col-span-1">
                <GlassCard className="h-[600px] flex flex-col p-0 overflow-hidden">
                    <div className="p-4 border-b border-white/10 bg-white/5">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <span className="text-xl">📝</span> Your Notes
                        </h2>
                        <p className="text-xs text-zinc-400 mt-1">Notes are saved automatically.</p>
                    </div>
                    <textarea
                        value={noteContent}
                        onChange={handleNoteChange}
                        onBlur={handleNoteBlur}
                        placeholder="Type your notes here... (timestamps, key takeaways, etc.)"
                        className="flex-1 w-full bg-transparent p-4 text-zinc-200 resize-none focus:outline-none placeholder:text-zinc-600 leading-relaxed font-mono text-sm"
                        spellCheck={false}
                    />
                </GlassCard>
            </div>
        </div>
    );
}
