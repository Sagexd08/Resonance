'use client';

import Link from 'next/link';
import Dock from '@/components/ui/Dock';
import { Home, Archive, User, Settings } from 'lucide-react';
import { Hero } from '@/components/marketing/Hero';
import { Features } from '@/components/marketing/Features';
import { MoodDemo } from '@/components/marketing/MoodDemo';
import { CTA } from '@/components/marketing/CTA';
import { Footer } from '@/components/marketing/Footer';
import { motion } from 'framer-motion';
import DarkVeil from '@/components/ui/DarkVeil';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#0a0a1a] text-white selection:bg-blue-500/30 overflow-hidden">
            {}

            <main>
                <div className="relative">
                    {}
                    <div className="absolute inset-0 z-0 opacity-40">
                        <DarkVeil
                            hueShift={0}
                            noiseIntensity={0}
                            scanlineIntensity={0}
                            speed={0.5}
                            scanlineFrequency={0}
                            warpAmount={0}
                            resolutionScale={1}
                        />
                    </div>

                    {}
                    <motion.div
                        className="fixed top-0 left-1/4 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"
                        animate={{ x: [0, 100, 0], y: [0, 50, 0], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none"
                        animate={{ x: [0, -80, 0], y: [0, -60, 0], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    />

                    <Hero />
                    <MoodDemo />
                    <Features />
                    <CTA />
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                        <Dock
                            items={[
                                { icon: <Home size={18} /> as any, label: 'Home', onClick: () => window.location.href = '/' },
                                { icon: <Archive size={18} /> as any, label: 'About', onClick: () => window.location.href = '#about' },
                                { icon: <User size={18} /> as any, label: 'Login', onClick: () => window.location.href = '/login' },
                                { icon: <Settings size={18} /> as any, label: 'Register', onClick: () => window.location.href = '/signup' },
                            ]}
                            panelHeight={68}
                            baseItemSize={50}
                            magnification={70}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
