"use client";

import { useState, useEffect } from "react";

export type PerformanceTier = "high" | "mid" | "low";

interface PerformanceCapabilities {
  tier: PerformanceTier;
  cpuCores: number;
  deviceMemory: number;
  hasGpu: boolean;
  reducedMotion: boolean;
  isMobile: boolean;
  isTouchDevice: boolean;
}

/**
 * Returns maximum performance capabilities.
 * Performance optimizations have been disabled to ensure all content
 * and animations are always visible.
 */
export function usePerformanceTier(): PerformanceCapabilities {
  const [capabilities, setCapabilities] = useState<PerformanceCapabilities>({
    tier: "high",
    cpuCores: 8,
    deviceMemory: 8,
    hasGpu: true,
    reducedMotion: false,
    isMobile: false,
    isTouchDevice: false,
  });

  useEffect(() => {
    // Always set to high performance
    setCapabilities({
      tier: "high",
      cpuCores: navigator.hardwareConcurrency || 8,
      deviceMemory: (navigator as any).deviceMemory || 8,
      hasGpu: true,
      reducedMotion: false,
      isMobile: false,
      isTouchDevice: false,
    });
  }, []);

  return capabilities;
}

export default usePerformanceTier;