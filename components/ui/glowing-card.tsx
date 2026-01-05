"use client";

import { cn } from "@/lib/utils";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface GlowingCardProps {
    children: React.ReactNode;
    className?: string;
    /** Custom animation delay for staggered animations */
    animationDelay?: number;
    /** Whether to show the glowing effect */
    glow?: boolean;
    /** Spread of the glow effect */
    spread?: number;
    /** Proximity to trigger the glow */
    proximity?: number;
    /** Inactive zone multiplier */
    inactiveZone?: number;
    /** Border width of the glow */
    borderWidth?: number;
    /** Card variant - affects inner styling */
    variant?: "default" | "numbered";
    /** Number index for numbered variant */
    index?: number;
}

export function GlowingCard({
    children,
    className,
    animationDelay = 0,
    glow = true,
    spread = 40,
    proximity = 64,
    inactiveZone = 0.01,
    borderWidth = 3,
}: GlowingCardProps) {
    return (
        <div
            className={cn(
                "relative min-h-[14rem] list-none",
                className
            )}
            style={{ animationDelay: `${animationDelay}s` }}
        >
            <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
                <GlowingEffect
                    spread={spread}
                    glow={glow}
                    disabled={false}
                    proximity={proximity}
                    inactiveZone={inactiveZone}
                    borderWidth={borderWidth}
                />
                <div className="glass-card relative flex h-full flex-col justify-between gap-4 overflow-hidden border-[0.75px] p-5 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

interface GlowingCardIconProps {
    children: React.ReactNode;
    className?: string;
}

export function GlowingCardIcon({ children, className }: GlowingCardIconProps) {
    return (
        <div className={cn(
            "w-fit rounded-lg border-[0.75px] border-border bg-muted p-2",
            className
        )}>
            {children}
        </div>
    );
}

interface GlowingCardTitleProps {
    children: React.ReactNode;
    className?: string;
}

export function GlowingCardTitle({ children, className }: GlowingCardTitleProps) {
    return (
        <h3 className={cn(
            "pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground dark:text-white",
            className
        )}>
            {children}
        </h3>
    );
}

interface GlowingCardDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export function GlowingCardDescription({ children, className }: GlowingCardDescriptionProps) {
    return (
        <p className={cn(
            "font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground dark:text-white/80",
            className
        )}>
            {children}
        </p>
    );
}

interface GlowingCardNumberProps {
    index: number;
    className?: string;
}

export function GlowingCardNumber({ index, className }: GlowingCardNumberProps) {
    return (
        <p className={cn(
            "text-xs font-semibold uppercase tracking-[0.35em] text-[var(--brand-pink)]",
            className
        )}>
            {String(index).padStart(2, '0')}
        </p>
    );
}

export { GlowingEffect };
