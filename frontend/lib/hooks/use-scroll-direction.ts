"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type ScrollDirection = "up" | "down" | "none";

interface ScrollInfo {
  direction: ScrollDirection;
  scrollY: number;
  scrollProgress: number; // 0 to 1
  velocity: number;
  isAtTop: boolean;
  isAtBottom: boolean;
}

/**
 * Tracks scroll direction, position, and velocity for scroll-based animations.
 * Useful for revealing/hiding navigation, parallax effects, etc.
 */
export function useScrollDirection(enabled = true): ScrollInfo {
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    direction: "none",
    scrollY: 0,
    scrollProgress: 0,
    velocity: 0,
    isAtTop: true,
    isAtBottom: false,
  });

  const lastScrollY = useRef(0);
  const lastTime = useRef(0);
  const ticking = useRef(false);

  const updateScrollInfo = useCallback(() => {
    if (typeof window === "undefined") return;

    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
    const isAtTop = scrollY < 10;
    const isAtBottom = scrollY >= maxScroll - 10;

    // Calculate velocity
    const now = performance.now();
    const timeDelta = now - lastTime.current;
    const scrollDelta = scrollY - lastScrollY.current;
    const velocity = timeDelta > 0 ? Math.abs(scrollDelta) / timeDelta : 0;

    // Determine direction
    let direction: ScrollDirection = "none";
    if (scrollDelta > 2) {
      direction = "down";
    } else if (scrollDelta < -2) {
      direction = "up";
    }

    setScrollInfo({
      direction,
      scrollY,
      scrollProgress,
      velocity: Math.min(velocity, 5), // Cap velocity
      isAtTop,
      isAtBottom,
    });

    lastScrollY.current = scrollY;
    lastTime.current = now;
    ticking.current = false;
  }, []);

  const handleScroll = useCallback(() => {
    if (!enabled || ticking.current) return;
    
    ticking.current = true;
    requestAnimationFrame(updateScrollInfo);
  }, [enabled, updateScrollInfo]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // Initialize
    lastScrollY.current = window.scrollY;
    lastTime.current = performance.now();
    updateScrollInfo();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [enabled, handleScroll, updateScrollInfo]);

  return scrollInfo;
}

export default useScrollDirection;