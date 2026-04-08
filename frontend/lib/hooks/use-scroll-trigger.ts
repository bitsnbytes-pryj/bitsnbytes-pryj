"use client";

import { useState, useEffect, useRef, RefObject } from "react";

interface ScrollTriggerOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

interface ScrollTriggerResult {
  ref: RefObject<HTMLElement | null>;
  isInView: boolean;
  progress: number;
  direction: "up" | "down" | null;
  hasEntered: boolean;
}

/**
 * Advanced scroll trigger hook for scroll-based animations.
 * Provides intersection detection, scroll progress, and direction awareness.
 */
export function useScrollTrigger(
  options: ScrollTriggerOptions = {}
): ScrollTriggerResult {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = false,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  } = options;

  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const [hasEntered, setHasEntered] = useState(false);

  const lastScrollY = useRef(0);
  const lastInView = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Intersection Observer for visibility
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const newIsInView = entry.isIntersecting;
        
        // Determine scroll direction
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY.current ? "down" : "up";
        lastScrollY.current = currentScrollY;
        setDirection(scrollDirection);

        // Handle state changes
        if (newIsInView && !lastInView.current) {
          // Entering view
          if (scrollDirection === "down") {
            onEnter?.();
          } else {
            onEnterBack?.();
          }
          setHasEntered(true);
        } else if (!newIsInView && lastInView.current) {
          // Leaving view
          if (scrollDirection === "down") {
            onLeave?.();
          } else {
            onLeaveBack?.();
          }
        }

        lastInView.current = newIsInView;

        if (triggerOnce && hasEntered) {
          setIsInView(true);
          return;
        }

        setIsInView(newIsInView);
      },
      {
        threshold,
        rootMargin,
      }
    );

    intersectionObserver.observe(element);

    // Scroll listener for progress calculation
    const handleScroll = () => {
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress (0 when element enters viewport, 1 when it leaves)
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Progress: 0 = just entering, 1 = just leaving
      const scrollProgress = Math.max(
        0,
        Math.min(
          1,
          1 - (elementTop + elementHeight) / (windowHeight + elementHeight)
        )
      );
      
      setProgress(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      intersectionObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    threshold,
    rootMargin,
    triggerOnce,
    hasEntered,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  ]);

  return { ref, isInView, progress, direction, hasEntered };
}

/**
 * Hook to track scroll progress across the entire page.
 */
export function usePageScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? currentScrollY / maxScroll : 0;
      
      setDirection(currentScrollY > lastScrollY.current ? "down" : "up");
      setProgress(Math.max(0, Math.min(1, scrollProgress)));
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { progress, direction };
}

/**
 * Hook for parallax effect values.
 */
export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * speed);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return offset;
}

export default useScrollTrigger;