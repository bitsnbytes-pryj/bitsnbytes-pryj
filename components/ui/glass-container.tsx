import { cn } from "@/lib/utils";
import React from "react";

interface GlassContainerProps {
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
    glowColor?: "pink" | "purple" | "both" | "none" | "teal" | "navy" | "amber";
    animated?: boolean;
}

export function GlassContainer({
    children,
    className,
    containerClassName,
    glowColor = "both",
    animated = true,
}: GlassContainerProps) {
    return (
        <div className={cn(
            "group relative overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] border border-white/10 bg-white/5 p-1.5 sm:p-2 transition-all duration-500 hover:border-white/20 hover:bg-white/10",
            "md:backdrop-blur-xl", // Only apply blur on larger screens for mobile performance
            containerClassName
        )}>
            {/* Reflective top edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className={cn(
                "relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[2.25rem] border border-white/10 bg-black/20",
                className
            )}>
                {/* Animated glass shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50" />
                {animated && (
                    <div className="absolute -inset-[100%] aspect-square bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_0%,transparent_50%)] animate-[spin_30s_linear_infinite]" />
                )}

                <div className="relative z-10 h-full">
                    {children}
                </div>
            </div>

            {/* Ambient glows - Sangam palette */}
            {(glowColor === "teal" || glowColor === "both") && (
                <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-teal-500/15 blur-[80px] transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
            )}
            {(glowColor === "navy" || glowColor === "both") && (
                <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-[#0a2540]/20 blur-[80px] transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
            )}
            {glowColor === "amber" && (
                <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-amber-500/15 blur-[80px] transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
            )}
            {/* Legacy support */}
            {glowColor === "pink" && (
                <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-teal-500/15 blur-[80px] transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
            )}
            {glowColor === "purple" && (
                <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-[#0a2540]/20 blur-[80px] transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
            )}
        </div>
    );
}
