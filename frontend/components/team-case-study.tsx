"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { CometCard } from "@/components/ui/comet-card";
import { cn } from "@/lib/utils";
import { Linkedin, User } from "lucide-react";

interface CoreTeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  expertise?: string[];
  linkedin?: string;
  accentColor?: string;
  isFounder?: boolean;
  isFeatured?: boolean;
}

interface Volunteer {
  id: number;
  name: string;
  image: string;
  linkedin?: string;
}

interface TeamCaseStudyProps {
  coreTeam: CoreTeamMember[];
  volunteers: Volunteer[];
}

const brandColors = [
  "bg-[var(--brand-purple)]",
  "bg-[var(--brand-pink)]",
  "bg-[var(--brand-plum)]",
];

function TeamCard({
  member,
  bgColor,
}: {
  member: CoreTeamMember;
  bgColor: string;
}) {
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const extractDominantColor = (img: HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check if image has valid dimensions
    if (img.naturalWidth === 0 || img.naturalHeight === 0) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    try {
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      // Sample every 100th pixel for performance (was 40th)
      for (let i = 0; i < data.length; i += 400) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      setDominantColor(`rgb(${r}, ${g}, ${b})`);
    } catch (error) {
      console.error("Error extracting dominant color:", error);
    }
  };

  const cardBg =
    member.accentColor ||
    (bgColor.includes("purple")
      ? "var(--brand-purple)"
      : bgColor.includes("pink")
        ? "var(--brand-pink)"
        : "var(--brand-plum)");

  const getBackgroundStyle = () => {
    if (dominantColor) {
      return `radial-gradient(circle at 50% 30%, ${dominantColor}33, ${dominantColor}11 50%, transparent 80%), ${cardBg}`;
    }
    // Apply subtle gradient even without dominant color for consistency
    if (member.accentColor) {
      return `radial-gradient(circle at 50% 30%, ${member.accentColor}dd, ${member.accentColor}aa 50%, ${member.accentColor} 80%)`;
    }
    return undefined;
  };

  return (
    <CometCard className="w-full">
      <div
        className={cn(
          "relative flex cursor-pointer flex-col rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-700",
          // Use h-full so CSS grid can ensure equal, content-fitting heights across all cards
          "h-full",
          "md:backdrop-blur-lg",
          // All core team members get the pretty pink border
          "border-2 border-[var(--brand-pink)]/40 shadow-[0_0_20px_rgba(228,90,146,0.2)]",
          // Founders get extra glow
          member.isFounder && "border-[var(--brand-pink)]/60 shadow-[0_0_30px_rgba(228,90,146,0.35)]",
          // Featured members (Aadrika) pop out even more
          member.isFeatured && "scale-[1.02] sm:scale-105 border-[var(--brand-pink)] shadow-[0_0_50px_rgba(228,90,146,0.5)] z-20 ring-2 ring-[var(--brand-pink)]/30",
          !member.accentColor && bgColor,
        )}
        style={{
          background: getBackgroundStyle(),
        }}
      >
        {/* Image section - larger for better portraits */}
        <div className="mx-1 sm:mx-2 h-[220px] sm:h-[280px] md:h-[320px] lg:h-[340px] flex-shrink-0">
          <div className="relative h-full w-full rounded-xl sm:rounded-2xl overflow-hidden">
            {/* Ambient glow background */}
            <div className="absolute inset-0 -z-10 scale-110 opacity-40 blur-2xl sm:blur-3xl">
              <Image
                src={member.image}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={60}
                className="object-cover"
              />
            </div>
            {/* Main image - centered */}
            <div className="relative h-full w-full overflow-hidden rounded-xl sm:rounded-2xl border border-white/10">
              <Image
                ref={imgRef}
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={90}
                className="object-cover object-top"
                onLoad={(e) => extractDominantColor(e.currentTarget)}
              />
            </div>
          </div>
        </div>

        {/* Text content section - cleaner without tags */}
        <div className="relative flex-1 mt-2 sm:mt-3">
          <div className="absolute inset-0 -mx-3 -mb-3 sm:-mx-4 sm:-mb-4 rounded-b-xl sm:rounded-b-2xl bg-black/80 backdrop-blur-md border-t border-white/10" />

          <div className="relative flex h-full flex-col p-3 sm:p-4 text-white z-10">
            {/* Header with role, name, and LinkedIn */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <span className="text-[0.6rem] sm:text-[0.7rem] font-black uppercase tracking-[0.1em] text-[var(--brand-pink)] mb-1 block leading-normal">
                  {member.role}
                </span>
                <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold tracking-tight leading-tight">
                  {member.name}
                </h3>
              </div>
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-white/15 transition-all hover:bg-white/25 hover:scale-110 border border-white/20"
                  aria-label={`${member.name}'s LinkedIn`}
                >
                  <Linkedin className="h-4 w-4 transition-transform group-hover:scale-110" />
                </a>
              )}
            </div>

            {/* Bio - cleaner and more readable */}
            <p className="text-xs sm:text-sm leading-relaxed text-white/90 font-medium">
              {member.bio}
            </p>
          </div>
        </div>
      </div>
    </CometCard>
  );
}

function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const [imageError, setImageError] = useState(false);
  const isPlaceholder = volunteer.image.includes("placeholder");

  return (
    <div className="group relative flex flex-col items-center w-24 sm:w-32">
      <div className="relative mb-2 sm:mb-3">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--brand-purple)] via-[var(--brand-pink)] to-[var(--brand-plum)] opacity-50 blur-lg group-hover:opacity-80 transition-opacity duration-300" />

        {/* Avatar container */}
        <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full border-2 border-white/20 bg-gradient-to-br from-[var(--brand-purple)] to-[var(--brand-plum)] group-hover:border-[var(--brand-pink)]/50 transition-all duration-300 group-hover:scale-105">
          {isPlaceholder || imageError ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--brand-purple)]/80 to-[var(--brand-plum)]/80">
              <User className="h-8 w-8 sm:h-10 sm:w-10 text-white/60" />
            </div>
          ) : (
            <Image
              src={volunteer.image}
              alt={volunteer.name}
              fill
              sizes="(max-width: 768px) 64px, (max-width: 1024px) 80px, 96px"
              quality={85}
              className="object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 text-center w-full">
        <h4 className="font-semibold text-sm sm:text-base text-white truncate w-full px-1">
          {volunteer.name}
        </h4>
        <span className="text-[0.6rem] sm:text-xs font-medium uppercase tracking-wider text-[var(--brand-pink)]/80">
          Volunteer
        </span>
        {/* Fixed height container for LinkedIn to keep grids aligned */}
        <div className="mt-1 h-7 flex items-center justify-center">
          {volunteer.linkedin ? (
            <a
              href={volunteer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20 hover:scale-110"
              aria-label={`${volunteer.name}'s LinkedIn`}
            >
              <Linkedin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function TeamCaseStudy({ coreTeam, volunteers }: TeamCaseStudyProps) {
  return (
    <div className="flex flex-col gap-8 sm:gap-16">
      {/* Core Team - CSS Grid with explicit 2 rows for equal heights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {coreTeam.map((member, index) => {
          const bgColor = brandColors[index % brandColors.length];

          return (
            <div key={member.id} className="h-full">
              <TeamCard member={member} bgColor={bgColor} />
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative bg-background px-4 sm:px-6">
          <span className="text-xs sm:text-sm font-medium uppercase tracking-widest text-[var(--brand-pink)]/70">
            Volunteers
          </span>
        </div>
      </div>

      {/* Volunteers Section - Improved Grid for Alignment */}
      <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-10 md:gap-14 lg:gap-16">
        {volunteers.map((volunteer) => (
          <VolunteerCard key={volunteer.id} volunteer={volunteer} />
        ))}
      </div>
    </div>
  );
}

