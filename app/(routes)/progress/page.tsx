"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { getVideosByCategory, getAllVideos } from "@/lib/video-utils";
import { Video } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { PieChart, Trophy, Star, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

function ProgressCard({
    title,
    total,
    completed,
    colorClass,
    icon: Icon
}: {
    title: string;
    total: number;
    completed: number;
    colorClass: string;
    icon: any;
}) {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <GlassCard className="p-6 relative overflow-hidden group">
            <div className={cn("absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity", colorClass)}>
                <Icon className="w-24 h-24" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className={cn("p-2 rounded-lg bg-white/5", colorClass)}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                </div>

                <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-bold text-white">{percentage}%</span>
                    <span className="text-sm text-zinc-400 mb-1">completed</span>
                </div>

                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full rounded-full transition-all duration-1000 ease-out", colorClass.replace('text-', 'bg-'))}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <div className="mt-4 text-xs text-zinc-500 font-medium">
                    {completed} of {total} videos watched
                </div>
            </div>
        </GlassCard>
    );
}

export default function ProgressPage() {
    const { progress, loadData } = useStore();
    const [stats, setStats] = useState({
        total: { count: 0, completed: 0 },
        beginner: { count: 0, completed: 0 },
        intermediate: { count: 0, completed: 0 },
        advanced: { count: 0, completed: 0 },
        motivational: { count: 0, completed: 0 }
    });

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        const calculateStats = () => {
            const beginnerVideos = getVideosByCategory('technical', 'beginner');
            const intermediateVideos = getVideosByCategory('technical', 'intermediate');
            const advancedVideos = getVideosByCategory('technical', 'advanced');
            const motivationalVideos = getVideosByCategory('motivational');
            const allVideos = [...beginnerVideos, ...intermediateVideos, ...advancedVideos, ...motivationalVideos];

            const isCompleted = (v: Video) => v.id && progress[v.id]?.completed;

            setStats({
                total: {
                    count: allVideos.length,
                    completed: allVideos.filter(isCompleted).length
                },
                beginner: {
                    count: beginnerVideos.length,
                    completed: beginnerVideos.filter(isCompleted).length
                },
                intermediate: {
                    count: intermediateVideos.length,
                    completed: intermediateVideos.filter(isCompleted).length
                },
                advanced: {
                    count: advancedVideos.length,
                    completed: advancedVideos.filter(isCompleted).length
                },
                motivational: {
                    count: motivationalVideos.length,
                    completed: motivationalVideos.filter(isCompleted).length
                }
            });
        };

        calculateStats();
    }, [progress]);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Progress</h1>
                <p className="text-zinc-400">Track your journey through system design mastery</p>
            </div>

          
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/50 via-purple-900/40 to-black border border-white/10 p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-lg relative z-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        {stats.total.completed === stats.total.count && stats.total.count > 0
                            ? "Absolute Legend! 🎉"
                            : "Keep Pushing Forward!"}
                    </h2>
                    <p className="text-zinc-300 text-lg">
                        You've completed <span className="text-white font-bold">{stats.total.completed}</span> out of <span className="text-white font-bold">{stats.total.count}</span> total videos.
                        {stats.total.completed === 0 && " Every expert was once a beginner. Start watching today!"}
                    </p>
                </div>

          
                <div className="relative z-10 flex-shrink-0">
                    <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                className="stroke-zinc-800 fill-none stroke-[8]"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                className={cn(
                                    "stroke-indigo-500 fill-none stroke-[8] transition-all duration-1000 ease-out",
                                    stats.total.completed === 0 && "opacity-0"
                                )}
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * (stats.total.count > 0 ? stats.total.completed / stats.total.count : 0))}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl md:text-4xl font-bold text-white">
                                {stats.total.count > 0 ? Math.round((stats.total.completed / stats.total.count) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </div>

         
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ProgressCard
                    title="Beginner"
                    total={stats.beginner.count}
                    completed={stats.beginner.completed}
                    colorClass="text-emerald-400"
                    icon={Star}
                />
                <ProgressCard
                    title="Intermediate"
                    total={stats.intermediate.count}
                    completed={stats.intermediate.completed}
                    colorClass="text-blue-400"
                    icon={Zap}
                />
                <ProgressCard
                    title="Advanced"
                    total={stats.advanced.count}
                    completed={stats.advanced.completed}
                    colorClass="text-purple-400"
                    icon={Target}
                />
                <ProgressCard
                    title="Advice"
                    total={stats.motivational.count}
                    completed={stats.motivational.completed}
                    colorClass="text-yellow-400"
                    icon={Trophy}
                />
            </div>
        </div>
    );
}
