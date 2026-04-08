"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { TeamMember, getBadgeStyles } from "@/lib/team-data"

interface TeamCardProps {
  member: TeamMember
}

export default function TeamCard({ member }: TeamCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const badgeStyles = getBadgeStyles(member.badge)

  return (
    <motion.div
      className="h-80 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: "1000px" }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of card - Image with splash shape */}
        <div
          className="absolute w-full h-full flex flex-col items-center justify-start overflow-hidden group hover:shadow-2xl transition-shadow"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className={`w-full h-56 overflow-hidden ${member.isPrayagrajChapter ? "bg-teal-900" : "bg-[#3e1e68]"}`}
            style={{
              borderRadius: "0 0 50% 50% / 0 0 40% 40%",
            }}
          >
            <Image
              src={member.image || "/placeholder.svg?height=224&width=400"}
              alt={member.name}
              width={400}
              height={224}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full flex-1 bg-white flex flex-col items-center justify-center px-4 py-4 relative">
            {/* Badge */}
            <div
              className={`absolute -top-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeStyles.bg} ${badgeStyles.text} ${badgeStyles.border}`}
            >
              {member.badge}
            </div>
            
            <h3 className="font-display font-bold text-[#3e1e68] text-lg text-center mt-2">{member.name}</h3>
            <p className={`${member.isPrayagrajChapter ? "text-teal-600" : "text-[#e45a92]"} text-sm mt-1 font-medium text-center`}>{member.role}</p>
          </div>
        </div>

        {/* Back of card - Bio info with splash shape */}
        <div
          className={`absolute w-full h-full ${member.isPrayagrajChapter ? "bg-teal-600" : "bg-[#e45a92]"} flex items-center justify-center overflow-hidden`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "0 0 50% 50% / 0 0 40% 40%",
          }}
        >
          <div className="text-center p-6">
            <div
              className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/30 bg-white/20 text-white mb-3`}
            >
              {member.badge}
            </div>
            <p className="text-white text-sm leading-relaxed font-medium">{member.achievements[0]}</p>
            <p className="text-white/70 text-xs mt-3">Click to flip back</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}