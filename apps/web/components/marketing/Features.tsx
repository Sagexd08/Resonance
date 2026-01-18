'use client';

import { motion } from 'framer-motion';
import {
    BrainCircuit,
    ShieldCheck,
    Zap,
    BarChart3,
    Users,
    Clock,
    Lock
} from 'lucide-react';

const FEATURES = [
    {
        title: "Neural Sentiment Engine",
        description: "Our proprietary transformer model analyzes anonymized sentiment data to predict team burnout before it spreads.",
        icon: BrainCircuit,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20"
    },
    {
        title: "Zero-Knowledge Privacy",
        description: "Military-grade encryption ensures individual responses remain 100% private. Managers only see aggregated team trends.",
        icon: Lock,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
    {
        title: "Real-time Pulse",
        description: "Forget annual surveys. Get instant feedback on your team's emotional health with daily 30-second check-ins.",
        icon: Zap,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20"
    },
    {
        title: "Actionable Analytics",
        description: "Don't just measure problems—solve them. We provide specific, research-backed recommendations for improvement.",
        icon: BarChart3,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        title: "Team Cohesion",
        description: "Foster a culture of empathy and understanding. Help remote teams feel connected and supported.",
        icon: Users,
        color: "text-pink-400",
        bg: "bg-pink-500/10",
        border: "border-pink-500/20"
    },
    {
        title: "Trend Tracking",
        description: "Visualize emotional trends over time. correlate wellness with productivity and retention metrics.",
        icon: Clock,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20"
    }
];

export const Features = () => {
    return (
        <section className="py-32 px-4 relative z-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full -z-10"
                    />
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        More than just a <span className="gradient-text">survey tool</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        A complete operating system for organizational health, powered by advanced emotional intelligence AI.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURES.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className={`group p-8 rounded-3xl bg-[#ffffff05] backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden`}
                        >
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${feature.bg.replace('/10', '/30')}`} />

                            <div className="relative z-10">
                                <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                </div>

                                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-200 transition-colors">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
