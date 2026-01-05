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

      // Sample every 10th pixel for performance
      for (let i = 0; i < data.length; i += 40) {
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
          "relative flex h-full cursor-pointer flex-col items-stretch rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-xl transition-all duration-700",
          member.isFounder
            ? "border-2 border-[var(--brand-pink)]/50 shadow-[0_0_30px_rgba(228,90,146,0.3)]"
            : "border border-white/10",
          !member.accentColor && bgColor,
        )}
        style={{
          background: getBackgroundStyle(),
        }}
      >
        <div className="mx-1 sm:mx-2">
          <div className="relative mt-1 sm:mt-2 aspect-[3/4] w-full rounded-xl sm:rounded-2xl">
            {/* Ambient glow background - YouTube style */}
            <div className="absolute inset-0 -z-10 scale-105 opacity-50 blur-2xl sm:blur-3xl">
              <Image
                src={member.image}
                alt=""
                fill
                className="object-cover rounded-xl sm:rounded-2xl"
              />
            </div>
            {/* Main image */}
            <div className="relative h-full w-full overflow-hidden rounded-xl sm:rounded-2xl">
              <Image
                ref={imgRef}
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                onLoad={(e) => extractDominantColor(e.currentTarget)}
              />
            </div>
          </div>
        </div>
        <div className="mt-3 sm:mt-4 flex min-h-[160px] sm:min-h-[180px] md:min-h-[220px] flex-col gap-1.5 sm:gap-2 p-3 sm:p-4 text-white">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className="text-[0.55rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.35em] opacity-70 line-clamp-1">
                {member.role}
              </span>
              <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold">
                {member.name}
              </h3>
            </div>
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20 hover:scale-110"
                aria-label={`${member.name}'s LinkedIn`}
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
              </a>
            )}
          </div>
          <p className="mb-auto text-xs sm:text-sm leading-relaxed opacity-80 line-clamp-3 sm:line-clamp-4">
            {member.bio}
          </p>
          {member.expertise && member.expertise.length > 0 ? (
            <div className="mt-auto pt-2 sm:pt-4 flex flex-wrap gap-1.5 sm:gap-2">
              {member.expertise.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 text-[0.55rem] sm:text-[0.65rem] font-semibold uppercase tracking-wide"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="pt-2 sm:pt-4 h-6 sm:h-8" />
          )}
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
      {/* Core Team - Flex wrap centered for 5 members */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
        {coreTeam.map((member, index) => {
          const bgColor = brandColors[index % brandColors.length];

          return (
            <div key={member.id} className="flex min-w-[280px] max-w-[340px] flex-1">
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

