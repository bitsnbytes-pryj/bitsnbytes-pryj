"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { TeamMember, getBadgeStyles } from "@/lib/team-data"
import { Sparkles, Zap, Star } from "lucide-react"

interface TeamCardProps {
  member: TeamMember
}

export default function TeamCard({ member }: TeamCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const badgeStyles = getBadgeStyles(member.badge)

  // 3D tilt effect values
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      className="h-96 cursor-pointer relative"
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        perspective: "1500px",
        transformStyle: "preserve-3d"
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{ 
          y: [0, -8, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: Math.random() * 2
        }}
        className="w-full h-full"
      >
        <motion.div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            rotateX: !isFlipped ? rotateX : 0,
            rotateY: isFlipped ? undefined : rotateY,
          }}
        >
          {/* Front of card - Image with splash shape */}
          <motion.div
            className="absolute w-full h-full flex flex-col items-center justify-start overflow-hidden group rounded-2xl"
            style={{ backfaceVisibility: "hidden" }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Glow effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
              style={{
                background: member.isPrayagrajChapter 
                  ? "radial-gradient(circle at 50% 50%, rgba(13, 148, 136, 0.3), transparent 70%)"
                  : "radial-gradient(circle at 50% 50%, rgba(227, 90, 146, 0.3), transparent 70%)"
              }}
            />

            {/* Animated border gradient */}
            <div 
              className="absolute inset-0 rounded-2xl p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: member.isPrayagrajChapter 
                  ? "linear-gradient(135deg, #0d9488, #22d3ee, #0d9488)"
                  : "linear-gradient(135deg, #e45a92, #a855f7, #e45a92)"
              }}
            >
              <div className="w-full h-full bg-[#0A1628] rounded-2xl" />
            </div>

            {/* Image section */}
            <div
              className={`w-full h-60 overflow-hidden relative`}
              style={{
                borderRadius: "1rem 1rem 40% 40%",
                background: member.isPrayagrajChapter 
                  ? "linear-gradient(180deg, #0d9488 0%, #0f766e 100%)"
                  : "linear-gradient(180deg, #3e1e68 0%, #2d1a4d 100%)"
              }}
            >
              <Image
                src={member.image || "/placeholder.svg?height=240&width=400"}
                alt={member.name}
                width={400}
                height={240}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Floating particles */}
              <motion.div 
                className="absolute top-4 right-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-white/60" />
              </motion.div>
            </div>

            {/* Info section */}
            <div className="w-full flex-1 bg-gradient-to-b from-white to-gray-50 flex flex-col items-center justify-center px-4 py-4 relative rounded-b-2xl">
              {/* Badge */}
              <motion.div
                className={`absolute -top-4 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeStyles.bg} ${badgeStyles.text} ${badgeStyles.border} shadow-lg`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {member.badge}
              </motion.div>
              
              <h3 className="font-display font-bold text-[#3e1e68] text-lg text-center mt-3">{member.name}</h3>
              <p className={`${member.isPrayagrajChapter ? "text-teal-600" : "text-[#e45a92]"} text-sm mt-1 font-medium text-center`}>{member.role}</p>
              
              {/* Decorative stars */}
              <div className="flex gap-1 mt-2">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  >
                    <Star className={`w-3 h-3 ${member.isPrayagrajChapter ? "text-teal-400" : "text-pink-400"} fill-current`} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Hover indicator */}
            <motion.div 
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-5 h-5 text-[#f59e0b]" />
            </motion.div>
          </motion.div>

          {/* Back of card - Bio info with enhanced design */}
          <motion.div
            className={`absolute w-full h-full rounded-2xl overflow-hidden`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: member.isPrayagrajChapter 
                ? "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #115e59 100%)"
                : "linear-gradient(135deg, #e45a92 0%, #be185d 50%, #9d174d 100%)"
            }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
              <motion.div
                className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/30 bg-white/20 text-white mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {member.badge}
              </motion.div>
              
              <h3 className="text-white text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-white/90 text-sm leading-relaxed font-medium mb-4">
                {member.achievements[0]}
              </p>
              
              {member.achievements[1] && (
                <p className="text-white/70 text-xs mb-4">
                  {member.achievements[1]}
                </p>
              )}

              {/* Decorative elements */}
              <div className="flex gap-2 mt-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-white/40"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
              
              <motion.p 
                className="text-white/60 text-xs mt-6"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Click to flip back
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}