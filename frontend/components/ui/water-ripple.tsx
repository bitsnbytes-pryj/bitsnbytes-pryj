"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { usePerformanceTier } from "@/lib/hooks";

interface WaterRippleProps {
  className?: string;
  rippleCount?: number;
  maxRadius?: number;
  rippleSpeed?: number;
  color?: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

/**
 * Water ripple effect component that responds to mouse/touch interactions.
 * Creates expanding ripples like water drops on a calm surface.
 */
export function WaterRipple({
  className = "",
  rippleCount = 3,
  maxRadius = 200,
  rippleSpeed = 3,
  color = "rgba(13, 148, 136, 0.3)",
}: WaterRippleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const animationRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true); // Use ref instead of state to avoid re-render loop
  const { canUseParticles, reducedMotion } = usePerformanceTier();

  // Disable on low-end devices or reduced motion
  const isEnabled = canUseParticles && !reducedMotion;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isEnabled) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Intersection observer to pause when not visible
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    // Animation loop
    const animate = () => {
      if (!isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Update and draw ripples
      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        ripple.radius += ripple.speed;
        ripple.opacity = 1 - ripple.radius / ripple.maxRadius;

        if (ripple.opacity <= 0) return false;

        // Draw ripple
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${ripple.opacity * 0.5})`);
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner glow
        const gradient = ctx.createRadialGradient(
          ripple.x, ripple.y, ripple.radius * 0.8,
          ripple.x, ripple.y, ripple.radius
        );
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(1, color.replace(/[\d.]+\)$/, `${ripple.opacity * 0.15})`));
        ctx.fillStyle = gradient;
        ctx.fill();

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [isEnabled, color]);

  // Create ripple on click/touch
  const createRipple = useCallback(
    (x: number, y: number) => {
      if (!isEnabled) return;

      // Limit concurrent ripples
      if (ripplesRef.current.length >= rippleCount * 2) return;

      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: maxRadius * (0.8 + Math.random() * 0.4),
        opacity: 1,
        speed: rippleSpeed * (0.8 + Math.random() * 0.4),
      });
    },
    [isEnabled, rippleCount, maxRadius, rippleSpeed]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      createRipple(e.clientX - rect.left, e.clientY - rect.top);
    },
    [createRipple]
  );

  const handleTouch = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const touch = e.touches[0];
      createRipple(touch.clientX - rect.left, touch.clientY - rect.top);
    },
    [createRipple]
  );

  if (!isEnabled) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      onClick={handleClick}
      onTouchStart={handleTouch}
      style={{ touchAction: "none" }}
    />
  );
}

/**
 * Hook for creating ripples programmatically
 */
export function useWaterRipple() {
  const ripplesRef = useRef<Ripple[]>([]);
  const animationRef = useRef<number | null>(null);

  const createRippleAt = useCallback(
    (
      canvas: HTMLCanvasElement,
      x: number,
      y: number,
      options: { maxRadius?: number; speed?: number; color?: string } = {}
    ) => {
      const { maxRadius = 150, speed = 2, color = "rgba(13, 148, 136, 0.3)" } = options;

      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius,
        opacity: 1,
        speed,
      });

      // Start animation if not running
      if (!animationRef.current) {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const animate = () => {
          ctx.clearRect(0, 0, rect.width, rect.height);

          ripplesRef.current = ripplesRef.current.filter((ripple) => {
            ripple.radius += ripple.speed;
            ripple.opacity = 1 - ripple.radius / ripple.maxRadius;

            if (ripple.opacity <= 0) return false;

            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${ripple.opacity * 0.5})`);
            ctx.lineWidth = 2;
            ctx.stroke();

            return true;
          });

          if (ripplesRef.current.length > 0) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            animationRef.current = null;
          }
        };

        animationRef.current = requestAnimationFrame(animate);
      }
    },
    []
  );

  return { createRippleAt };
}

export default WaterRipple;