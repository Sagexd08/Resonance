'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Smile, Frown, Meh, Zap, Activity } from 'lucide-react';
import clsx from 'clsx';

const MOODS = [
    { label: 'Energized', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/20', border: 'border-amber-400/50', desc: 'Feeling ready to take on challenges!' },
    { label: 'Happy', icon: Smile, color: 'text-emerald-400', bg: 'bg-emerald-400/20', border: 'border-emerald-400/50', desc: 'Positive and content.' },
    { label: 'Neutral', icon: Meh, color: 'text-blue-400', bg: 'bg-blue-400/20', border: 'border-blue-400/50', desc: 'Steady and balanced.' },
    { label: 'Drained', icon: Frown, color: 'text-rose-400', bg: 'bg-rose-400/20', border: 'border-rose-400/50', desc: 'Need a break to recharge.' },
];

export const MoodDemo = () => {
    const [selectedMood, setSelectedMood] = useState(MOODS[1]);

    return (
        <section className="py-24 px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                            See how <span className="gradient-text">Resonance</span> works
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Experience our intuitive check-in system. It takes less than 30 seconds to log your state.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Interaction Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass p-8 relative overflow-hidden rounded-3xl border-t border-white/20 shadow-2xl"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                        <h3 className="text-2xl font-bold mb-8 text-white">How are you feeling today?</h3>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {MOODS.map((mood) => {
                                const Icon = mood.icon;
                                const isSelected = selectedMood.label === mood.label;
                                return (
                                    <button
                                        key={mood.label}
                                        onClick={() => setSelectedMood(mood)}
                                        className={clsx(
                                            "p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 relative overflow-hidden group",
                                            isSelected
                                                ? `${mood.border} bg-white/10`
                                                : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"
                                        )}
                                    >
                                        <div className={clsx("absolute inset-0 opacity-0 transition-opacity duration-300", isSelected && "opacity-20", mood.bg)} />
                                        <Icon className={clsx("w-8 h-8 relative z-10 transition-transform duration-300 group-hover:scale-110", mood.color)} />
                                        <span className="font-semibold text-sm relative z-10 tracking-wide text-gray-200">{mood.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 backdrop-blur-sm">
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-blue-500/20">
                                    <Activity className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-blue-300 uppercase tracking-wider mb-1">AI Insight</p>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {selectedMood.desc}
                                        {selectedMood.label === 'Drained' && " Suggest taking a 15 min walk."}
                                        {selectedMood.label === 'Energized' && " Great time for complex tasks."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Visualizer Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative perspective-1000"
                    >
                        {/* Mock Dashboard Card */}
                        <motion.div
                            className="glass p-8 transform rotate-y-12 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#0a0a1a]/80 backdrop-blur-xl"
                            whileHover={{ rotateY: 0, scale: 1.02 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="font-bold text-xl text-white">Team Pulse</h4>
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Live
                                </div>
                            </div>

                            {/* Mock Chart Bars */}
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm font-medium text-gray-400">
                                        <span>Team Energy Level</span>
                                        <span className="text-white">78%</span>
                                    </div>
                                    <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                            animate={{ width: selectedMood.label === 'Energized' ? '85%' : selectedMood.label === 'Drained' ? '40%' : '65%' }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm font-medium text-gray-400">
                                        <span>Burnout Variance</span>
                                        <span className={selectedMood.label === 'Drained' ? 'text-red-400' : 'text-green-400'}>
                                            {selectedMood.label === 'Drained' ? 'High Risk' : 'Stable'}
                                        </span>
                                    </div>
                                    <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                                            animate={{
                                                width: selectedMood.label === 'Drained' ? '75%' : '12%',
                                                backgroundColor: selectedMood.label === 'Drained' ? '#ef4444' : '#10b981'
                                            }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mock Team Members */}
                            <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
                                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Active Members</div>
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-4 border-[#0a0a1a] flex items-center justify-center text-xs text-white font-bold ring-2 ring-transparent hover:ring-blue-500 transition-all z-0 hover:z-10 transform hover:scale-110">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full bg-gray-800 border-4 border-[#0a0a1a] flex items-center justify-center text-xs text-gray-400 font-bold">
                                        +5
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Decorative blobs */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
