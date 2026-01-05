"use client";

import { Entropy } from "@/components/ui/entropy";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <Entropy size={280} className="rounded-xl" />
      <p className="mt-6 font-mono text-sm text-white/60 tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  );
}
