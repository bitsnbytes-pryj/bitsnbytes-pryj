"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
    image?: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    addAnimation();
  }, [items, direction, speed]);

  // Track which testimonial is currently most visible
  useEffect(() => {
    if (!scrollerRef.current || !containerRef.current) return;

    const updateActiveIndex = () => {
      if (!scrollerRef.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      const cards = scrollerRef.current.querySelectorAll("li");
      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index % items.length; // Modulo to handle duplicates
        }
      });

      setActiveIndex(closestIndex);
    };

    const interval = setInterval(updateActiveIndex, 500);
    return () => clearInterval(interval);
  }, [items.length, start]);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  const renderCard = (
    item: (typeof items)[0],
    idx: number,
    isDuplicate: boolean = false,
  ) => (
    <li
      className="glass-card relative isolate w-[280px] sm:w-[320px] md:w-[380px] lg:w-[420px] shrink-0 p-4 sm:p-5 md:p-6 text-foreground shadow-xl dark:text-white"
      key={
        isDuplicate ? `${item.name}-duplicate-${idx}` : `${item.name}-${idx}`
      }
    >
      <blockquote>
        <div
          aria-hidden="true"
          className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
        ></div>
        <span className="relative z-20 text-xs sm:text-sm leading-[1.6] font-normal text-foreground line-clamp-4 sm:line-clamp-none">
          {item.quote}
        </span>
        <div className="relative z-20 mt-4 sm:mt-6 flex flex-row items-center gap-2 sm:gap-3">
          {item.image && (
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
              {/* Ambient glow background */}
              <div className="absolute inset-0 -z-10 scale-150 opacity-40 blur-xl">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              {/* Main image */}
              <div className="relative h-full w-full overflow-hidden rounded-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          <span className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
            <span className="text-xs sm:text-sm leading-[1.6] font-medium text-foreground dark:text-white truncate">
              {item.name}
            </span>
            <span className="text-[10px] sm:text-sm leading-[1.6] font-normal text-muted-foreground truncate">
              {item.title}
            </span>
          </span>
        </div>
      </blockquote>
    </li>
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-full overflow-hidden">
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "scroller relative z-20 w-full max-w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
          className,
        )}
      >
        <ul
          ref={scrollerRef}
          className={cn(
            "flex w-max min-w-full shrink-0 flex-nowrap gap-3 sm:gap-4 py-4 px-2 sm:px-0",
            start && "animate-scroll",
            pauseOnHover && "hover:[animation-play-state:paused]",
          )}
        >
          {items.map((item, idx) => renderCard(item, idx, false))}
          {/* Duplicate items for infinite scroll */}
          {items.map((item, idx) => renderCard(item, idx, true))}
        </ul>
      </div>

      {/* Pagination dots and status */}
      <div className="flex flex-col items-center gap-2 sm:gap-3 px-4">
        {/* Dots - hide some on mobile if too many */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
          {items.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Testimonial ${idx + 1}`}
              className={cn(
                "h-1.5 sm:h-2 rounded-full transition-all duration-300",
                activeIndex === idx
                  ? "w-4 sm:w-6 bg-[var(--brand-pink)]"
                  : "w-1.5 sm:w-2 bg-white/30 hover:bg-white/50",
              )}
            />
          ))}
        </div>

        {/* Counter and status */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
          <span className="font-medium text-foreground dark:text-white">
            {activeIndex + 1}
          </span>
          <span>/</span>
          <span>{items.length}</span>
          {isPaused && (
            <span className="ml-1.5 sm:ml-2 inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] uppercase tracking-wider">
              <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-yellow-400"></span>
              Paused
            </span>
          )}
          {!isPaused && (
            <span className="ml-1.5 sm:ml-2 inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] uppercase tracking-wider">
              <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Auto
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
