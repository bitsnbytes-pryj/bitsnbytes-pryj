"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X, Github } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@public/logo.svg";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/impact", label: "Impact" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 10);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 flex w-full justify-center">
      <div
        className={cn(
          "w-full max-w-full border-b border-white/10 bg-white/90 px-3 sm:px-4 py-2 sm:py-3 shadow-[var(--shadow-card)] backdrop-blur-2xl transition-all dark:border-white/10 dark:bg-white/5",
          isScrolled &&
          "border-white/20 bg-white shadow-[var(--glow-soft)] dark:bg-white/10",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 sm:gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 sm:gap-3"
          >
            <div className="relative grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-xl sm:rounded-2xl bg-black text-white shadow-[0_8px_30px_rgba(228,90,146,0.4)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_12px_40px_rgba(228,90,146,0.6)]">
              <Image
                src={logo}
                alt="Bits&Bytes logo"
                width={32}
                height={32}
                className="h-6 w-6 sm:h-8 sm:w-8 object-contain transition-transform duration-300 group-hover:rotate-12"
                priority
              />
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-[var(--brand-pink)]" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-base sm:text-lg font-semibold text-foreground">
                Bits&Bytes
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-muted-foreground">
                India
              </span>
            </div>
          </Link>

          <nav className="relative hidden items-center gap-0.5 sm:gap-1 rounded-full border border-white/30 bg-white/80 px-1 py-1 text-xs sm:text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md dark:border-white/10 dark:bg-white/10 md:flex">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative rounded-full px-3 sm:px-4 py-1 sm:py-1.5 transition-all duration-300",
                    isActive
                      ? "rounded-full bg-[var(--brand-pink)] text-white shadow-[var(--glow-soft)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                  {/* Hover underline animation */}
                  {!isActive && (
                    <span className="absolute bottom-0.5 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-[var(--brand-pink)] transition-all duration-300 group-hover:w-3/4" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="https://github.com/gobitsnbytes"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/30 bg-white/70 text-foreground transition hover:border-white/50 hover:text-[var(--brand-pink)] dark:bg-white/10 md:inline-flex"
              aria-label="GitHub"
            >
              <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
            <Link
              href="/join"
              prefetch={true}
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "hidden items-center gap-1 rounded-full bg-[var(--brand-pink)] text-white shadow-[var(--glow-strong)] md:inline-flex text-xs sm:text-sm px-3 sm:px-4",
              )}
            >
              Join Now
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl border border-white/30 bg-white/70 text-foreground transition hover:border-white/50 dark:bg-white/10 md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="absolute top-full left-0 w-full border-t border-white/10 bg-white/95 p-3 sm:p-4 shadow-[var(--shadow-card)] backdrop-blur-2xl dark:bg-[#05020a]/95 md:hidden animate-in slide-in-from-top-5 fade-in duration-200">
            <div className="flex flex-col gap-1.5 sm:gap-2">
              {NAV_LINKS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-all",
                      isActive
                        ? "bg-[var(--brand-pink)]/10 text-[var(--brand-pink)]"
                        : "text-foreground/80 hover:bg-white/5 hover:text-foreground dark:text-white/80",
                    )}
                  >
                    {item.label}
                    <ArrowUpRight
                      className={cn(
                        "h-3.5 w-3.5 sm:h-4 sm:w-4",
                        isActive
                          ? "text-[var(--brand-pink)]"
                          : "text-muted-foreground",
                      )}
                    />
                  </Link>
                );
              })}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-1.5 sm:my-2" />
              <Button
                asChild
                className="w-full rounded-lg sm:rounded-xl bg-[var(--brand-pink)] py-5 sm:py-6 text-sm sm:text-base font-semibold text-white shadow-[var(--glow-strong)] hover:bg-[var(--brand-plum)]"
              >
                <Link
                  href="/join"
                  prefetch={true}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2"
                >
                  Join the Club{" "}
                  <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
