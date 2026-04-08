"use client";

import { MiniNavbar } from "@/components/ui/mini-navbar";
import Image from "next/image";

const MiniNavbarDemo = () => {
    return (
        <div className="relative min-h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    className="w-full h-full object-cover grayscale opacity-40"
                    src="https://images.unsplash.com/photo-1464802686167-b939a67a06a1?q=80&w=2069&auto=format&fit=crop"
                    alt="Background Stars"
                    fill
                    priority
                />
            </div>

            <MiniNavbar />

            <main className="relative z-10 flex flex-col items-center justify-center h-screen text-center px-4 pt-24">
                <h1 className="text-6xl md:text-9xl font-bold text-white mb-4 tracking-tighter drop-shadow-2xl">
                    MINI NAVBAR
                </h1>
                <div className="flex flex-col sm:flex-row items-center text-xl text-white/60 mb-8 space-y-2 sm:space-y-0 sm:space-x-3">
                    <span className="font-medium">Please support by saving this component</span>
                    <button
                        className="px-6 py-2 border border-white/10 bg-white/5 rounded-full text-white transition-all duration-300 cursor-pointer text-base
                       inline-flex items-center justify-center hover:bg-white/10 hover:border-white/20 active:scale-95"
                    >
                        <span className="font-bold">Thank You</span>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default MiniNavbarDemo;
