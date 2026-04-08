import { cn } from "@/lib/utils";

// Simplified version - removed heavy SVG filter that causes lag on Safari/Firefox
export function LiquidGlassFilter() {
  // No longer rendering the heavy SVG filter
  return null;
}

type LiquidGlassBackdropProps = {
  radiusClassName?: string;
  className?: string;
  blurClassName?: string;
};

export function LiquidGlassBackdrop({
  radiusClassName = "rounded-full",
  className,
  blurClassName,
}: LiquidGlassBackdropProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0",
        // Simplified shadow effect without the heavy filter
        "shadow-[0_0_15px_rgba(0,0,0,0.1),inset_1px_1px_2px_rgba(255,255,255,0.4),inset_-1px_-1px_2px_rgba(0,0,0,0.2)]",
        "dark:shadow-[0_0_12px_rgba(0,0,0,0.35),inset_1px_1px_2px_rgba(255,255,255,0.1),inset_-1px_-1px_2px_rgba(0,0,0,0.4)]",
        "transition-shadow duration-300",
        radiusClassName,
        className,
      )}
    />
  );
}
