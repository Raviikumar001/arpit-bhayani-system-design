"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { BookOpen, Trophy, LayoutDashboard } from "lucide-react";

// Paths remain mostly the same, but we ensure 'technical' maps to 'levels' in utils
// and 'motivational/all' maps to the flat list.
const navItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Technical",
        items: [
            { name: "Beginner", href: "/technical/beginner" },
            { name: "Intermediate", href: "/technical/intermediate" },
            { name: "Advanced", href: "/technical/advanced" },
        ],
        icon: BookOpen
    },
    {
        title: "Motivation & Advice",
        items: [
            { name: "All Videos", href: "/motivational/all" },
        ],
        icon: Trophy
    }
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen sticky top-0 hidden md:flex flex-col p-4 gap-4">
            <Link href="/" className="mb-4 px-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Arpit Bhayani
                </h1>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Learning Hub</p>
            </Link>

            <div className="space-y-6">
                {navItems.map((section) => (
                    <div key={section.title}>
                        {section.items ? (
                            <>
                                <div className="flex items-center gap-2 px-3 mb-2 text-zinc-400 text-sm font-medium uppercase tracking-wider">
                                    <section.icon className="w-4 h-4" />
                                    {section.title}
                                </div>
                                <div className="space-y-1">
                                    {section.items.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link key={item.href} href={item.href}>
                                                <div className={cn(
                                                    "px-3 py-2 rounded-lg text-sm transition-all duration-200 border border-transparent",
                                                    isActive
                                                        ? "bg-white/10 text-white border-white/10 shadow-sm backdrop-blur-sm"
                                                        : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                                                )}>
                                                    {item.name}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <Link href={section.href}>
                                <div className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 border border-transparent font-medium",
                                    pathname === section.href
                                        ? "bg-white/10 text-white border-white/10 shadow-sm backdrop-blur-sm"
                                        : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                                )}>
                                    <section.icon className="w-4 h-4" />
                                    {section.title}
                                </div>
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-auto">
                <GlassCard className="p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-white/5 text-xs text-zinc-400">
                    <p>Built for learning.</p>
                    <p className="mt-1 opacity-50">Offline capable.</p>
                </GlassCard>
            </div>
        </aside>
    );
}
