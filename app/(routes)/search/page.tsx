"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Video } from "@/types";
import { searchVideos, getCommonTags } from "@/lib/video-utils";
import { VideoGrid } from "@/components/video/VideoGrid";
import { Search as SearchIcon, Loader2 } from "lucide-react";

import { Suspense } from "react";

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<Video[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [commonTags] = useState(() => getCommonTags(12));

    // Debounce search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) {
                setIsSearching(true);
                const matches = searchVideos(query);
                setResults(matches);
                setIsSearching(false);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="min-h-screen bg-black">
            <div className="p-8 max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-white mb-8">
                        Search Library
                    </h1>

                    {/* Apple Glass Pill Search Bar */}
                    <div className="max-w-xl mx-auto">
                        <div className="flex items-center h-12 px-4 rounded-full bg-zinc-800/60 border border-zinc-600/40 backdrop-blur-2xl transition-all duration-200 focus-within:border-zinc-500/60 focus-within:bg-zinc-700/50">
                            <SearchIcon className="w-4 h-4 text-zinc-400 shrink-0" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search"
                                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-white text-base placeholder:text-zinc-500 px-3 py-2"
                                autoFocus
                            />
                            {isSearching && <Loader2 className="w-4 h-4 text-zinc-400 animate-spin shrink-0" />}
                        </div>
                    </div>

                    {/* Suggested Keywords */}
                    {!query.trim() && (
                        <div className="max-w-2xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            <p className="text-zinc-500 text-sm mb-4 font-medium tracking-wide">Popular Topics</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {commonTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setQuery(tag)}
                                        className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-sm text-zinc-400 hover:text-white transition-all duration-300 backdrop-blur-md"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {query.trim() && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between text-zinc-400 text-sm px-2">
                            <span>Found {results.length} results for "{query}"</span>
                        </div>

                        {results.length > 0 ? (
                            <VideoGrid videos={results} />
                        ) : (
                            <div className="text-center py-20 text-zinc-500">
                                <p className="text-2xl mb-2">😕</p>
                                <p>No videos found matching your search.</p>
                            </div>
                        )}
                    </div>
                )}

                {!query.trim() && (
                    <div className="text-center py-20 opacity-50">
                        <p className="text-zinc-600">Type something to start searching...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
