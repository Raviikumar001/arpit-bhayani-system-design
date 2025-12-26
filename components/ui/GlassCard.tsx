import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({
    children,
    className,
    hoverEffect = false,
    ...props
}: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg transition-all duration-300",
                hoverEffect && "hover:bg-white/10 hover:scale-[1.01] hover:shadow-xl hover:border-white/20",
                className
            )}
            {...props}
        >
            {/* Noise texture overlay for texture (optional, can be added globally) */}
            <div className="absolute inset-0 z-[-1] opacity-5 pointer-events-none" />
            {children}
        </div>
    );
}
