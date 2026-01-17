'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function HomePage() {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(26,166,228,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(26,166,228,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

            <motion.div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
                animate={{ x: [0, -80, 0], y: [0, -60, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">R</span>
                    </div>
                    <span className="text-xl font-bold">Resonance</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4"
                >
                    {session ? (
                        <Link
                            href="/dashboard"
                            className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </motion.div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center px-8 pt-20 pb-32 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-8 inline-block">
                        ✨ AI-Powered Employee Wellness
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                >
                    <span className="gradient-text">Feel the pulse</span>
                    <br />
                    of your team
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-400 max-w-2xl mb-12"
                >
                    Daily emotional check-ins in 30 seconds. Team health visibility.
                    AI-powered recommendations to prevent burnout before it happens.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-4"
                >
                    <Link
                        href={session ? '/dashboard' : '/signup'}
                        className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                    >
                        Start for Free
                        <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                    <Link
                        href="/demo"
                        className="px-8 py-4 rounded-2xl glass glass-hover text-white font-semibold text-lg"
                    >
                        Watch Demo
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-12 mt-20"
                >
                    {[
                        { value: '30s', label: 'Check-in time' },
                        { value: '24h', label: 'Alert response' },
                        { value: '40%', label: 'Burnout reduction' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-4xl font-bold gradient-text">{stat.value}</div>
                            <div className="text-gray-500 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </main>

            {/* Features Preview */}
            <section className="relative z-10 px-8 py-20">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: '🎯',
                            title: 'Quick Check-ins',
                            description: 'Log mood, energy, and stress in seconds with our intuitive emoji-based interface.',
                        },
                        {
                            icon: '📊',
                            title: 'Smart Analytics',
                            description: 'Track personal trends and team-level insights while maintaining privacy.',
                        },
                        {
                            icon: '🤖',
                            title: 'AI Recommendations',
                            description: 'Get actionable suggestions powered by our custom transformer model.',
                        },
                    ].map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                            className="p-6 glass glass-hover"
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
