'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, CheckCircle2, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { useSession } from 'next-auth/react';

export const Hero = () => {
    const { data: session } = useSession();

    return (
        <section className="relative pt-32 pb-32 px-4 overflow-hidden perspective-1000">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative mb-8"
                >
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                    <div className="relative px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-900/10 backdrop-blur-md text-sm font-medium text-blue-300 flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Resonance AI 2.0 is Live
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight stroke-text"
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40 drop-shadow-2xl">
                        Harmonize Your
                    </span>
                    <br />
                    <span className="relative inline-block">
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-30" />
                        <span className="gradient-text relative z-10 filter drop-shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                            Team's Frequencies
                        </span>
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12 leading-relaxed"
                >
                    The first <span className="text-white font-semibold">biometric-aware</span> employee wellness platform.
                    Decode burnout signals before they impact performance.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto relative z-20"
                >
                    <Link
                        href={session ? '/dashboard' : '/signup'}
                        className="group relative px-8 py-4 rounded-2xl bg-white text-black font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                        passHref
                    >
                        {/* @ts-ignore */}
                        {session ? 'Launch Dashboard' : 'Get Started Now'}
                        {/* @ts-ignore */}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 rounded-2xl ring-2 ring-white/50 animate-pulse-glow" />
                    </Link>

                    <Link
                        href="#demo"
                        className="group relative px-8 py-4 rounded-2xl glass text-white font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                        passHref
                    >
                        {/* @ts-ignore */}
                        <Play className="w-5 h-5 fill-current" />
                        Live Demo
                    </Link>
                </motion.div>

                {/* Floating Cards - 3D Effect */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-16 hidden lg:block pointer-events-none perspective-500">
                    <motion.div
                        animate={{ y: [0, -20, 0], rotateX: [10, 5, 10], rotateY: [10, 15, 10] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="glass p-6 w-64 rotate-12 backdrop-blur-md border-t border-white/20 shadow-2xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            {/* @ts-ignore */}
                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><ShieldCheck size={24} /></div>
                            <div>
                                <div className="text-sm text-gray-400">Team Health</div>
                                <div className="text-xl font-bold text-white">98% Optimal</div>
                            </div>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[98%]" />
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 right-0 translate-y-20 translate-x-20 hidden lg:block pointer-events-none perspective-500">
                    <motion.div
                        animate={{ y: [0, 30, 0], rotateX: [-10, -5, -10], rotateY: [-20, -15, -20] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                        className="glass p-6 w-64 -rotate-12 backdrop-blur-md border-t border-white/20 shadow-2xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            {/* @ts-ignore */}
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Zap size={24} /></div>
                            <div>
                                <div className="text-sm text-gray-400">Burnout Risk</div>
                                <div className="text-xl font-bold text-white">Low Impact</div>
                            </div>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[15%]" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

