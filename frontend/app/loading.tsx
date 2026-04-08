"use client";

import { CpuArchitecture } from "@/components/ui/cpu-architecture";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <CpuArchitecture className="w-80 h-auto" />
      <p className="mt-6 font-mono text-sm text-white/60 tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  );
}
