"use client";

import { useState, useEffect, useCallback } from "react";

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1 (centered)
  normalizedY: number; // -1 to 1 (centered)
  clientX: number;
  clientY: number;
}

/**
 * Tracks mouse position globally for parallax, magnetic effects, etc.
 * Returns normalized coordinates for easy use in animations.
 */
export function useMousePosition(enabled = true): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    clientX: 0,
    clientY: 0,
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    setPosition({
      x,
      y,
      normalizedX: (x - centerX) / centerX, // -1 to 1
      normalizedY: (y - centerY) / centerY, // -1 to 1
      clientX: e.clientX,
      clientY: e.clientY,
    });
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // Check for touch device - don't track mouse on touch devices
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [enabled, handleMouseMove]);

  return position;
}

export default useMousePosition;