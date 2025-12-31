"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { BookOpen, Trophy, LayoutDashboard, Info, ChevronLeft, ChevronRight, Search } from "lucide-react";

const navItems = [
    {
        title: "Search",
        href: "/search",
        icon: Search,
    },
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
    },
    {
        title: "About",
        href: "/about",
        icon: Info
    }
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "h-screen sticky top-0 hidden md:flex flex-col p-4 gap-4 transition-all duration-300 border-r border-white/5 bg-black/50 backdrop-blur-xl z-50",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex items-center justify-between px-2 mb-4">
                {!isCollapsed && (
                    <Link href="/">
                        <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
                            Arpit Bhayani
                        </h1>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 whitespace-nowrap">Learning Hub</p>
                    </Link>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto scrollbar-hide">
                {navItems.map((section) => (
                    <div key={section.title}>
                        {section.items ? (
                            <>
                                {!isCollapsed ? (
                                    <>
                                        <div className="flex items-center gap-2 px-3 mb-2 text-zinc-400 text-sm font-medium uppercase tracking-wider whitespace-nowrap">
                                            <section.icon className="w-4 h-4" />
                                            {section.title}
                                        </div>
                                        <div className="space-y-1">
                                            {section.items.map((item) => {
                                                const isActive = pathname === item.href;
                                                return (
                                                    <Link key={item.href} href={item.href}>
                                                        <div className={cn(
                                                            "px-3 py-2 rounded-lg text-sm transition-all duration-200 border border-transparent whitespace-nowrap",
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
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="group relative flex justify-center p-2 mb-2 text-zinc-400 hover:text-white">
                                            <section.icon className="w-5 h-5" />
                                            <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 border border-white/10 rounded text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                                {section.title}
                                            </div>
                                        </div>
                                        {/* Collapsed sub-items simplified or hidden? Ideally accessible. 
                                             For simplicity in this collapsing mode, maybe we just show the main category icon and if clicked it goes to first item? 
                                             Or we list all sub-items as dots? 
                                             Let's keep it simple: Show specific icons for sub-items if they had unique icons, but they don't.
                                             Let's just show links for sub items as small dots or initials?
                                             Actually, for valid UX in collapsed mode with submenus, we usually use popovers. 
                                             Given the constraints, I'll simplify: just show the category icon acting as a link to the first item.
                                         */}
                                        {section.items.map((item) => (
                                            <Link key={item.href} href={item.href} className="w-full flex justify-center">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full transition-colors",
                                                    pathname === item.href ? "bg-blue-500" : "bg-zinc-700 hover:bg-zinc-500"
                                                )} title={item.name} />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link href={section.href!!}>
                                <div className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 border border-transparent font-medium",
                                    pathname === section.href
                                        ? "bg-white/10 text-white border-white/10 shadow-sm backdrop-blur-sm"
                                        : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5",
                                    isCollapsed && "justify-center px-0 py-3"
                                )}>
                                    <section.icon className="w-5 h-5" />
                                    {!isCollapsed && <span>{section.title}</span>}
                                </div>
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {!isCollapsed && (
                <div className="mt-auto">
                    <GlassCard className="p-4 bg-linear-to-r from-indigo-500/20 to-purple-500/20 border-white/5 text-xs text-zinc-400">
                        <p>Built for learning.</p>
                        <p className="mt-1 opacity-50">Offline capable.</p>
                    </GlassCard>
                </div>
            )}
        </aside>
    );
}
