import { Card, CardContent } from '@/components/ui/card'
import { Users, Rocket, CodeXml, Trophy } from 'lucide-react'
import Image from 'next/image'

export function Features() {
    return (
        <div className="mx-auto max-w-6xl">
            <div className="relative">
                <div className="relative z-10 grid grid-cols-6 gap-6">
                    {/* Club & Community - Big Card (Left) */}
                    <Card className="relative col-span-full overflow-hidden lg:col-span-3 glass-panel border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardContent className="flex h-full flex-col justify-between pt-8 pb-12">
                            <div className="space-y-6">
                                <div className="relative flex aspect-square size-14 rounded-full border border-white/10 bg-white/5 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5">
                                    <Users className="m-auto size-7 text-[var(--brand-pink)]" />
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-3xl font-bold font-display text-white transition">200+ Members</h2>
                                    <p className="text-zinc-400 max-w-sm">A tight-knit crew of ambitious teen builders shipping together across India.</p>
                                </div>
                            </div>

                            <div className="mt-12 relative flex h-32 items-center justify-start gap-0">
                                {/* Avatars overlap container */}
                                <div className="flex -space-x-4">
                                    {[
                                        { name: "Yash", img: "/team/yash.jpeg" },
                                        { name: "Aadrika", img: "/team/aadrika.png" },
                                        { name: "Akshat", img: "/team/akshat.webp" },
                                        { name: "Maryam", img: "/team/maryam.jpeg" },
                                        { name: "Oviyaa", img: "/team/oviyaa.jpeg" }
                                    ].map((m, i) => (
                                        <div key={i} className="relative group ring-2 ring-[#0F0816] rounded-full overflow-hidden w-14 h-14 transition-transform hover:-translate-y-1 z-[10]">
                                            <Image
                                                className="size-full object-cover"
                                                src={m.img}
                                                alt={m.name}
                                                width={56}
                                                height={56}
                                            />
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-bold text-white z-0 -ml-4 pl-4">
                                        +195
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column Container */}
                    <div className="col-span-full lg:col-span-3 grid grid-rows-2 gap-6">
                        {/* Projects - Upper Card */}
                        <Card className="relative overflow-hidden glass-panel border-white/10 bg-white/5 backdrop-blur-xl group hover:border-[var(--brand-pink)]/50 transition-colors">
                            <CardContent className="h-full pt-8 pb-8 flex flex-col justify-between">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3">
                                        <h2 className="text-2xl font-bold text-white transition">15+ Projects</h2>
                                        <p className="text-sm text-zinc-400 max-w-[240px]">Real-world builds, from developer tools to AI-powered apps.</p>
                                    </div>
                                    <div className="relative flex aspect-square size-12 rounded-xl border border-white/10 bg-white/5">
                                        <CodeXml className="m-auto size-6 text-[var(--brand-pink)]" />
                                    </div>
                                </div>
                                <div className="mt-6 flex items-end gap-2 text-4xl font-black text-white/5 font-display select-none">
                                    SHIPPED
                                </div>
                            </CardContent>
                            {/* Decorative line */}
                            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[var(--brand-pink)] to-transparent group-hover:w-full transition-all duration-500" />
                        </Card>

                        {/* Reach & Events - Bottom Card */}
                        <Card className="relative overflow-hidden glass-panel border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardContent className="h-full pt-8 pb-8">
                                <div className="grid grid-cols-2 gap-6 h-full">
                                    <div className="space-y-4 border-r border-white/10 pr-6">
                                        <div className="flex aspect-square size-10 rounded-lg bg-zinc-400/10">
                                            <Rocket className="m-auto size-5 text-white/70" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-2xl font-bold text-white">10+</div>
                                            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Partners</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pl-0">
                                        <div className="flex aspect-square size-10 rounded-lg bg-[var(--brand-pink)]/10">
                                            <Rocket className="m-auto size-5 text-[var(--brand-pink)]" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-2xl font-bold text-white">100%</div>
                                            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Collaborative</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
