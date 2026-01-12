"use client";

import { useEffect, useState, useRef } from "react";
import { useStore } from "@/store/useStore";
import { Video } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { CheckCircle, Check, Clock, BookOpen, PanelRightClose, PanelRightOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoDetailProps {
    video: Video;
}

export function VideoDetail({ video }: VideoDetailProps) {
    const { progress, notes, markCompleted, saveNote, loadData, updateProgress } = useStore();
    const [noteContent, setNoteContent] = useState("");
    const [showNotes, setShowNotes] = useState(false); 
    const isVideoCompleted = video.id ? progress[video.id]?.completed : false;

  
    const dataLoaded = useRef(false);

    useEffect(() => {
        loadData().then(() => {
            dataLoaded.current = true;
            if (video.id && notes[video.id]) {
                setNoteContent(notes[video.id].content);
            }
        });
    }, [loadData, video.id]);

   
    useEffect(() => {
        if (video.id && notes[video.id]) {
            setNoteContent(notes[video.id].content);
        } else {
            setNoteContent("");
        }
    }, [video.id, notes]);

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


    useEffect(() => {
        if (video.id) {
            updateProgress(video.id, Date.now());
        }
    }, [video.id, updateProgress]);

    return (
        <div className="relative min-h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6">
            {/* Video Player Section - Expands if notes are hidden */}
            <div className={cn(
                "flex-1 transition-all duration-300 ease-in-out" 
            )}>
                
                <div className="space-y-6">
                    <div className={cn(
                        "w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 relative group",
                        showNotes ? "aspect-video" : "aspect-video lg:h-[70vh] lg:aspect-auto"
                    )}>
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

                    <div className="flex flex-col md:flex-row items-start justify-between gap-6 px-4 md:px-0">
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{video.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-zinc-400">
                                {video.focus && (
                                    <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10 text-zinc-300 font-medium">
                                        {video.focus}
                                    </span>
                                )}
                           
                                <span className="flex items-center gap-2">
                                    <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                                    Arpit Bhayani
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={handleToggleComplete}
                                className={cn(
                                    "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 transform active:scale-95 shadow-lg hover:shadow-green-500/20",
                                    isVideoCompleted
                                        ? "bg-green-500 text-black hover:bg-green-400 border border-green-400/50"
                                        : "bg-white text-black hover:bg-zinc-200"
                                )}
                            >
                                {isVideoCompleted ? (
                                    <Check className="w-5 h-5 stroke-3" />
                                ) : (
                                    <CheckCircle className="w-5 h-5" />
                                )}
                                {isVideoCompleted ? "Completed" : "Mark as Complete"}
                            </button>

                            <button
                                onClick={() => setShowNotes(!showNotes)}
                                className={cn(
                                    "flex items-center justify-center gap-2 px-4 py-3 rounded-full font-medium transition-colors border",
                                    showNotes
                                        ? "bg-blue-600/20 border-blue-500/50 text-blue-400"
                                        : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                                )}
                                title={showNotes ? "Hide Notes" : "Show Notes"}
                            >
                                {showNotes ? <PanelRightOpen className="w-5 h-5" /> : <PanelRightClose className="w-5 h-5" />}
                                <span className="hidden md:inline">{showNotes ? "Hide Notes" : "Notes"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

         
            <div className={cn(
                "fixed inset-y-0 right-0 z-40 w-full md:w-96 bg-zinc-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-transform duration-300 ease-in-out",
                
                !showNotes ? "translate-x-full lg:hidden" : "translate-x-0",
          
                "lg:relative lg:transform-none lg:h-auto lg:shadow-none lg:bg-transparent lg:border-none lg:backdrop-blur-none",
                showNotes ? "lg:block" : "lg:hidden"
            )}>
                <div className="flex flex-col h-full pt-20 lg:pt-0 bg-zinc-900 lg:bg-black/40 lg:border lg:border-white/10 lg:rounded-2xl lg:overflow-hidden">
                  

                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <h2 className="font-semibold text-xl flex items-center gap-2 text-white">
                            <BookOpen className="w-5 h-5 text-blue-400" />
                            Your Notes
                        </h2>
                        <button onClick={() => setShowNotes(false)} className="lg:hidden p-2 text-zinc-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 p-0 overflow-hidden relative group">
                        <textarea
                            value={noteContent}
                            onChange={handleNoteChange}
                            onBlur={handleNoteBlur}
                            placeholder="Type your notes here... (timestamps, key takeaways, etc.)"
                            className="w-full h-full bg-transparent p-6 text-zinc-200 resize-none focus:outline-none placeholder:text-zinc-600 leading-relaxed font-mono text-sm"
                            spellCheck={false}
                        />
                        <div className="absolute bottom-4 right-4 text-[10px] text-zinc-600 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            Auto-saved
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile when notes are open */}
            {showNotes && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setShowNotes(false)}
                />
            )}
        </div>
    );
}
