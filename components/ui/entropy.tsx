'use client'
import React, { useEffect, useRef, useState } from 'react'

interface EntropyProps {
    className?: string
    size?: number
}

export function Entropy({ className = "", size = 400 }: EntropyProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [isVisible, setIsVisible] = React.useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (canvasRef.current) observer.observe(canvasRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        if (!isVisible) return; // Pause when not visible

        const ctxMaybe = canvas.getContext('2d', { alpha: false }) // Optimization: Disable alpha if possible
        if (!ctxMaybe) return
        const ctx: CanvasRenderingContext2D = ctxMaybe

        // Detect low-perf
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowPerf = isMobile || window.innerWidth < 768;

        // Base settings
        const dpr = Math.min(window.devicePixelRatio || 1, isLowPerf ? 1 : 2)
        canvas.width = size * dpr
        canvas.height = size * dpr
        canvas.style.width = `${size}px`
        canvas.style.height = `${size}px`
        ctx.scale(dpr, dpr)

        // Use black theme
        const particleColor = '#ffffff'

        class Particle {
            x: number
            y: number
            size: number
            order: boolean
            velocity: { x: number; y: number }
            originalX: number
            originalY: number
            influence: number
            neighbors: Particle[]

            constructor(x: number, y: number, order: boolean) {
                this.x = x
                this.y = y
                this.originalX = x
                this.originalY = y
                this.size = isLowPerf ? 1.5 : 2
                this.order = order
                this.velocity = {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2
                }
                this.influence = 0
                this.neighbors = []
            }

            update() {
                if (this.order) {
                    const dx = this.originalX - this.x
                    const dy = this.originalY - this.y

                    const chaosInfluence = { x: 0, y: 0 }
                    this.neighbors.forEach(neighbor => {
                        if (!neighbor.order) {
                            const distance = Math.hypot(this.x - neighbor.x, this.y - neighbor.y)
                            const strength = Math.max(0, 1 - distance / 100)
                            chaosInfluence.x += (neighbor.velocity.x * strength)
                            chaosInfluence.y += (neighbor.velocity.y * strength)
                            this.influence = Math.max(this.influence, strength)
                        }
                    })

                    this.x += dx * 0.05 * (1 - this.influence) + chaosInfluence.x * this.influence
                    this.y += dy * 0.05 * (1 - this.influence) + chaosInfluence.y * this.influence
                    this.influence *= 0.99
                } else {
                    this.velocity.x += (Math.random() - 0.5) * 0.5
                    this.velocity.y += (Math.random() - 0.5) * 0.5
                    this.velocity.x *= 0.95
                    this.velocity.y *= 0.95
                    this.x += this.velocity.x
                    this.y += this.velocity.y

                    if (this.x < size / 2 || this.x > size) this.velocity.x *= -1
                    if (this.y < 0 || this.y > size) this.velocity.y *= -1
                    this.x = Math.max(size / 2, Math.min(size, this.x))
                    this.y = Math.max(0, Math.min(size, this.y))
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                const alpha = this.order ?
                    0.8 - this.influence * 0.5 :
                    0.8
                ctx.fillStyle = `${particleColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        // Create particle grid - Reduced size for performance
        const particles: Particle[] = []
        const gridSize = isLowPerf ? 15 : 25
        const spacing = size / gridSize

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const x = spacing * i + spacing / 2
                const y = spacing * j + spacing / 2
                const order = x < size / 2
                particles.push(new Particle(x, y, order))
            }
        }

        function updateNeighbors() {
            particles.forEach(particle => {
                particle.neighbors = particles.filter(other => {
                    if (other === particle) return false
                    const distance = Math.hypot(particle.x - other.x, particle.y - other.y)
                    return distance < (isLowPerf ? 70 : 100)
                })
            })
        }

        let time = 0
        let animationId: number
        let lastFrameTime = 0
        const frameInterval = 1000 / (isLowPerf ? 30 : 60);

        function animate(currentTime: number) {
            animationId = requestAnimationFrame(animate)

            if (currentTime - lastFrameTime < frameInterval) return;
            lastFrameTime = currentTime;

            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, size, size)

            if (time % (isLowPerf ? 60 : 30) === 0) {
                updateNeighbors()
            }

            particles.forEach(particle => {
                particle.update()
                particle.draw(ctx)

                particle.neighbors.forEach(neighbor => {
                    const distance = Math.hypot(particle.x - neighbor.x, particle.y - neighbor.y)
                    const limit = isLowPerf ? 35 : 50
                    if (distance < limit) {
                        const alpha = 0.2 * (1 - distance / limit)
                        ctx.strokeStyle = `${particleColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
                        ctx.beginPath()
                        ctx.moveTo(particle.x, particle.y)
                        ctx.lineTo(neighbor.x, neighbor.y)
                        ctx.stroke()
                    }
                })
            })

            ctx.strokeStyle = `${particleColor}4D`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(size / 2, 0)
            ctx.lineTo(size / 2, size)
            ctx.stroke()

            time++
        }

        animationId = requestAnimationFrame(animate)

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId)
            }
        }
    }, [size, isVisible])

    return (
        <div className={`relative bg-black ${className}`} style={{ width: size, height: size }}>
            <canvas
                ref={canvasRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
        </div>
    )
}
