"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Client-side only components (no SSR)
const InternalFloatingAiAssistant = dynamic(
  () => import("@/components/ui/glowing-ai-chat-assistant").then(mod => ({ default: mod.FloatingAiAssistant })),
  { ssr: false }
);

export function FloatingAiAssistant() {
  const pathname = usePathname();
  if (pathname === "/qna") {
    return null;
  }
  return <InternalFloatingAiAssistant />;
}
