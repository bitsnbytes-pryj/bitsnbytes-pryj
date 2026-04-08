"use client";

import { useMemo } from "react";

export type PerformanceTier = "high" | "mid" | "low";

export interface PerformanceCapabilities {
  tier: PerformanceTier;
  cpuCores: number;
  deviceMemory: number;
  hasGpu: boolean;
  reducedMotion: boolean;
  isMobile: boolean;
  isTouchDevice: boolean;
  canUseWebGL: boolean;
  canUseParticles: boolean;
  canUseBlur: boolean;
  canUseComplexAnimations: boolean;
}

/**
 * Returns maximum performance capabilities.
 * Performance optimizations have been disabled to ensure all content
 * and animations are always visible on all devices.
 */
export function usePerformanceTier(): PerformanceCapabilities {
  return useMemo(() => ({
    tier: "high",
    cpuCores: 8,
    deviceMemory: 8,
    hasGpu: true,
    reducedMotion: false,
    isMobile: false,
    isTouchDevice: false,
    canUseWebGL: true,
    canUseParticles: true,
    canUseBlur: true,
    canUseComplexAnimations: true,
  }), []);
}

export default usePerformanceTier;