"use client";

import { Suspense } from "react";
import LumaSpin from "@/components/ui/luma-spin";

export function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LumaSpin />
    </div>
  );
}

export function LoadingInline() {
  return (
    <div className="flex items-center justify-center py-12">
      <LumaSpin />
    </div>
  );
}

interface LoadingWrapperProps {
  children: React.ReactNode;
  inline?: boolean;
}

export function LoadingWrapper({ children, inline = false }: LoadingWrapperProps) {
  return (
    <Suspense fallback={inline ? <LoadingInline /> : <LoadingFallback />}>
      {children}
    </Suspense>
  );
}

