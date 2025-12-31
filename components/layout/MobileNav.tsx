"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Trophy, User, Search, Info, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
    const pathname = usePathname();

    const navItems = [
        {
            label: "Home",
            href: "/",
            icon: Home
        },
        {
            label: "Search",
            href: "/search",
            icon: Search
        },
        {
            label: "Learn",
            href: "/technical/beginner",
            icon: BookOpen
        },
        {
            label: "Progress",
            href: "/progress",
            icon: PieChart
        },
        {
            label: "Advice",
            href: "/motivational/all",
            icon: Trophy
        },
        {
            label: "About",
            href: "/about",
            icon: Info
        },
    ];

    return (
        <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden flex justify-center pb-safe">
            <div className="flex items-center justify-between w-full max-w-sm px-2 py-3 bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl ring-1 ring-white/5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-300",
                                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-5 h-5 transition-all duration-300",
                                    isActive && "scale-110 fill-current drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                                )}
                            />
                            <span className={cn(
                                "text-[10px] font-medium tracking-wide transition-all duration-300",
                                isActive && "font-semibold drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
