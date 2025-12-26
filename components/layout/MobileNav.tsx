"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Trophy, User } from "lucide-react";
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
            label: "Learn",
            href: "/technical/beginner",
            icon: BookOpen
        },
        {
            label: "Advice",
            href: "/motivational/all",
            icon: Trophy
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/10 md:hidden pb-safe">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1",
                                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
