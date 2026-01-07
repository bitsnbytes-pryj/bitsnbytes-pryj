import { cn } from "@/lib/utils";
import React from "react";

interface GlassContainerProps {
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
    glowColor?: "pink" | "purple" | "both" | "none";
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
            "group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-2 backdrop-blur-2xl transition-all duration-500 hover:border-white/20 hover:bg-white/10",
            containerClassName
        )}>
            {/* Reflective top edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className={cn(
                "relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-black/20",
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

            {/* Ambient glows */}
            {(glowColor === "pink" || glowColor === "both") && (
                <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-(--brand-pink)/10 blur-[80px] transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
            )}
            {(glowColor === "purple" || glowColor === "both") && (
                <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-(--brand-purple)/10 blur-[80px] transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
            )}
        </div>
    );
}
