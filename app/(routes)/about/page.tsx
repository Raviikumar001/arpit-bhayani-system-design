"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { ExternalLink, Github, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12">

            {/* Arpit Bhayani Section */}
            <section className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-blue-500/20 shadow-2xl shrink-0">
                        <img
                            src="https://edge.arpitbhayani.me/img/arpit-6.jpg"
                            alt="Arpit Bhayani"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-center md:text-left space-y-4">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Arpit Bhayani
                        </h1>
                        <p className="text-zinc-300 text-lg leading-relaxed max-w-2xl">
                            Arpit is a software engineer and educator known for his deep dives into system design, backend engineering, and scaling distributed systems. His content powers the careers of thousands of engineers worldwide.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <a href="https://www.youtube.com/@AsliEngineering" target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600/20 transition-colors border border-red-600/20">
                                <Youtube className="w-5 h-5" />
                                <span>YouTube</span>
                            </a>
                            <a href="https://www.linkedin.com/in/arpitbhayani/" target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-500 rounded-lg hover:bg-blue-600/20 transition-colors border border-blue-600/20">
                                <Linkedin className="w-5 h-5" />
                                <span>LinkedIn</span>
                            </a>
                            <a href="https://arpitbhayani.me/courses" target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600/10 text-emerald-500 rounded-lg hover:bg-emerald-600/20 transition-colors border border-emerald-600/20">
                                <ExternalLink className="w-5 h-5" />
                                <span>Courses</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Disclaimer */}
            <GlassCard className="border-yellow-500/20 bg-yellow-500/5 px-3 py-2">
                <h3 className="text-yellow-500 font-bold mb-2 flex items-center gap-2">
                    <span>⚠️</span> Disclaimer
                </h3>
                <p className="text-zinc-400 text-sm">
                    This is an unofficial educational project. All video content, titles, and intellectual property belong to Arpit Bhayani.
                    This dashboard is built solely for educational purposes and provide an organized viewing experience.
                </p>
            </GlassCard>

            {/* Developer Credits */}
            <section className="text-center pt-8 border-t border-white/5">
                <p className="text-zinc-500 text-sm mb-4">Developed with ❤️ by</p>
                <GlassCard className="inline-flex items-center gap-4 px-6 py-3 hover:bg-white/5 transition-colors cursor-default">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
                        R
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-white">Ravi Kumar</div>
                        <div className="text-xs text-zinc-500">Software Developer </div>
                    </div>
                    <a href="https://github.com/Raviikumar001" target="_blank" rel="noopener noreferrer" className="ml-4 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                        <Github className="w-5 h-5 text-white" />
                    </a>
                </GlassCard>
            </section>

        </div>
    );
}
