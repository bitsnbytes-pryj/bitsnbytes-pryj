"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { cn } from "@/lib/utils";
import { fadeInUp } from "@/lib/motion";

type PageSectionProps = {
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  align?: "left" | "center";
  as?: "section" | "div";
  bleed?: boolean;
  animate?: boolean;
};

export function PageSection({
  children,
  className,
  eyebrow,
  title,
  description,
  align = "left",
  as: Component = "section",
  bleed = false,
  animate = true,
}: PageSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  const headingAlignment =
    align === "center" ? "items-center text-center" : "text-left";

  const MotionComponent = motion(Component as any);

  return (
    <MotionComponent
      ref={ref}
      className={cn(
        "section-shell py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden",
        bleed && "max-w-none px-0 sm:px-6",
        className,
      )}
      initial={animate ? "hidden" : undefined}
      animate={animate && isInView ? "visible" : undefined}
      variants={fadeInUp}
    >
      {(eyebrow || title || description) && (
        <div
          className={cn(
            "mb-6 sm:mb-8 md:mb-10 flex flex-col gap-2 sm:gap-3",
            headingAlignment,
          )}
        >
          {eyebrow && (
            <span className="section-eyebrow text-[0.6rem] sm:text-[0.7rem] px-3 sm:px-4">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
          )}
          {description && (
            <p className="max-w-3xl text-sm sm:text-base md:text-lg text-foreground/90 font-medium px-2 sm:px-0">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </MotionComponent>
  );
}

export default PageSection;