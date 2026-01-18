'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Loader2, Sparkles, TrendingUp, Users,
    Brain, Zap, Activity, ShieldAlert, AlertCircle
} from 'lucide-react';
import { containerReveal, itemReveal } from '../../../lib/motion/transitions';


import { Stack } from '../../../components/primitives/Stack';
import { Text } from '../../../components/primitives/Text';
import { GlassSurface } from '../../../components/primitives/GlassSurface';
import { Button } from '../../../components/ui/Button';
import { MoodPicker } from '../../../components/emotional/MoodPicker';
import { BurnoutMeter } from '../../../components/emotional/BurnoutMeter';

interface DashboardMetrics {
    personal: {
        totalCheckIns: number;
        avgMood: number;
        avgEnergy: number;
        avgStress: number;
        burnoutRisk: number;
        insights: Array<{
            type: 'critical' | 'warning' | 'positive' | 'neutral';
            text: string;
            icon: string;
        }>;
        recentEntries: Array<{
            date: string;
            mood: number;
            energy: number;
            stress: number;
        }>;
    };
    team: {
        avgMood: number;
        avgEnergy: number;
        activeMembers: number;
        totalCheckIns: number;
        recentActivity: Array<{
            userId: string;
            timestamp: string;
            mood: 'happy' | 'neutral' | 'drained';
        }>;
    } | null;
}

function ActivityIcon({ score }: { score: number }) {
    if (score > 7) return <div className="w-5 h-5 rounded-full bg-emo-happy shadow-[0_0_10px_var(--emo-happy-glow)]" />;
    if (score < 4) return <div className="w-5 h-5 rounded-full bg-emo-drained shadow-[0_0_10px_var(--emo-drained-glow)]" />;
    return <div className="w-5 h-5 rounded-full bg-emo-neutral shadow-[0_0_10px_var(--emo-neutral-glow)]" />;
}

function InsightIcon({ icon, type }: { icon: string, type: string }) {
    const className = type === 'critical' ? 'text-emo-burnout' :
        type === 'warning' ? 'text-emo-energized' :
            type === 'positive' ? 'text-emo-happy' : 'text-accent-primary';

    switch (icon) {
        case 'ShieldAlert': return <ShieldAlert className={`w-5 h-5 ${className}`} />;
        case 'AlertCircle': return <AlertCircle className={`w-5 h-5 ${className}`} />;
        case 'Zap': return <Zap className={`w-5 h-5 ${className}`} />;
        case 'Sparkles': return <Sparkles className={`w-5 h-5 ${className}`} />;
        default: return <Activity className={`w-5 h-5 ${className}`} />;
    }
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchMetrics();
        }
    }, [status]);

    const fetchMetrics = async () => {
        try {
            const response = await fetch('/api/metrics');
            if (!response.ok) throw new Error('Failed to fetch metrics');
            const data = await response.json();
            setMetrics(data);
        } catch (error) {
            console.error('Error fetching metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
            </div>
        );
    }

    if (!metrics) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <Text variant="h3" className="text-text-secondary">No data available. Complete your first check-in!</Text>
            </div>
        );
    }

    const userName = session?.user?.name?.split(' ')[0] || 'there';

    return (
        <motion.div
            variants={containerReveal}
            initial="initial"
            animate="animate"
            className="w-full max-w-7xl mx-auto p-6 md:p-12 min-h-screen"
        >
            <Stack gap={10}>
                {}
                <motion.div variants={itemReveal}>
                    <Stack gap={2}>
                        <Stack direction="row" align="center" gap={3}>
                            <Text variant="display" className="text-5xl md:text-6xl text-text-primary">
                                Hello,
                            </Text>
                            <Text
                                variant="display"
                                gradient="energized"
                                className="text-5xl md:text-6xl font-black"
                            >
                                {userName}
                            </Text>
                        </Stack>
                        <Text variant="body-lg" className="text-text-secondary max-w-xl">
                            Your emotional frequency is stabilizing. Let's adjust your resonance.
                        </Text>
                    </Stack>
                </motion.div>

                {/* Main Interactive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* 1. Daily Check-in (Emotional Core) */}
                    <motion.div
                        variants={itemReveal}
                        className="lg:col-span-2"
                    >
                        <GlassSurface intensity="medium" className="p-8 h-full relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl -z-10 group-hover:bg-accent-primary/20 transition-colors duration-slow" />

                            <Stack gap={8}>
                                <Stack direction="row" justify="between" align="center">
                                    <Stack gap={1}>
                                        <Text variant="h3" className="text-text-primary">Daily Resonance</Text>
                                        <Text variant="body-sm" className="text-text-tertiary uppercase tracking-wider">Log your emotional state</Text>
                                    </Stack>
                                    <Sparkles className="text-accent-secondary w-6 h-6 animate-pulse-slow" />
                                </Stack>

                                <MoodPicker
                                    onSelect={(mood: any) => {
                                        router.push(`/check-in?mood=${mood}`);
                                    }}
                                />

                                <Stack direction="row" justify="end">
                                    <Button
                                        variant="glass"
                                        size="sm"
                                        rightIcon={<ArrowRight className="w-4 h-4" />}
                                        onClick={() => router.push('/check-in')}
                                    >
                                        Detailed Check-in
                                    </Button>
                                </Stack>
                            </Stack>
                        </GlassSurface>
                    </motion.div>

                    {/* 2. Burnout Risk (Metric Viz) */}
                    <motion.div variants={itemReveal}>
                        <GlassSurface intensity="heavy" className="p-8 h-full flex flex-col justify-between">
                            <Stack gap={4}>
                                <Text variant="h4" className="text-text-secondary">Vitality Index</Text>
                                <div className="flex justify-center py-4">
                                    <BurnoutMeter score={metrics.personal.burnoutRisk} className="scale-110" />
                                </div>

                                <div className="p-4 rounded-xl bg-surface-2 border border-surface-3">
                                    <Stack gap={2}>
                                        <Stack direction="row" justify="between">
                                            <Text variant="caption">Avg Energy</Text>
                                            <Text variant="micro" className="text-text-primary">{metrics.personal.avgEnergy.toFixed(1)}/10</Text>
                                        </Stack>
                                        <div className="h-1 bg-surface-5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emo-energized rounded-full"
                                                style={{ width: `${(metrics.personal.avgEnergy / 10) * 100}%` }}
                                            />
                                        </div>

                                        <Stack direction="row" justify="between" className="mt-2">
                                            <Text variant="caption">Avg Stress</Text>
                                            <Text variant="micro" className="text-text-primary">{metrics.personal.avgStress.toFixed(1)}/10</Text>
                                        </Stack>
                                        <div className="h-1 bg-surface-5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emo-burnout rounded-full"
                                                style={{ width: `${(metrics.personal.avgStress / 10) * 100}%` }}
                                            />
                                        </div>
                                    </Stack>
                                </div>
                            </Stack>
                        </GlassSurface>
                    </motion.div>
                </div>

                {/* AI Insights & Real-time Pulse */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Dynamic AI Insights */}
                    <motion.div variants={itemReveal}>
                        <GlassSurface intensity="medium" className="p-6 h-full border-l-4 border-accent-primary">
                            <Stack gap={6}>
                                <Stack direction="row" align="center" gap={3}>
                                    <Brain className="w-6 h-6 text-accent-primary" />
                                    <Text variant="h4">Neural Insights</Text>
                                </Stack>

                                <Stack gap={4}>
                                    {metrics.personal.insights.map((insight, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            className="p-4 bg-surface-2 rounded-lg border border-surface-5 group hover:border-accent-primary/50 transition-colors"
                                        >
                                            <Stack direction="row" gap={4} align="center">
                                                <InsightIcon icon={insight.icon} type={insight.type} />
                                                <Text variant="body-sm" className="text-text-secondary group-hover:text-text-primary transition-colors">
                                                    {insight.text}
                                                </Text>
                                            </Stack>
                                        </motion.div>
                                    ))}
                                </Stack>
                            </Stack>
                        </GlassSurface>
                    </motion.div>

                    {/* Team Activity Stream */}
                    <motion.div variants={itemReveal}>
                        <GlassSurface intensity="medium" className="p-6 h-full">
                            <Stack gap={6}>
                                <Stack direction="row" justify="between" align="center">
                                    <Stack direction="row" align="center" gap={3}>
                                        <Activity className="w-6 h-6 text-accent-secondary" />
                                        <Text variant="h4">Team Stream</Text>
                                    </Stack>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-secondary/10 border border-accent-secondary/20 shadow-glow-soft" style={{ '--glow-color': 'var(--accent-secondary)' } as any}>
                                        <div className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
                                        <Text variant="micro" className="text-accent-secondary font-bold tracking-widest">LIVE</Text>
                                    </div>
                                </Stack>

                                {metrics.team?.recentActivity ? (
                                    <Stack gap={3}>
                                        {metrics.team.recentActivity.map((activity, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center justify-between p-3 bg-surface-2/50 rounded-xl border border-surface-5"
                                            >
                                                <Stack direction="row" align="center" gap={3}>
                                                    <div className={`w-2 h-2 rounded-full bg-emo-${activity.mood}`} />
                                                    <Text variant="micro" className="text-text-tertiary">User #{activity.userId}</Text>
                                                </Stack>
                                                <Text variant="micro" className="text-text-tertiary italic">
                                                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Text>
                                            </motion.div>
                                        ))}
                                        <div className="flex -space-x-3 mt-4 pt-4 border-t border-surface-5">
                                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    whileHover={{ y: -5, scale: 1.1 }}
                                                    className="w-10 h-10 rounded-full border-2 border-bg-primary bg-surface-4 flex items-center justify-center text-xs font-bold text-text-tertiary shadow-lg"
                                                >
                                                    {String.fromCharCode(64 + i)}
                                                </motion.div>
                                            ))}
                                            <div className="w-10 h-10 rounded-full border-2 border-bg-primary bg-accent-primary flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                                +{metrics.team.activeMembers > 6 ? metrics.team.activeMembers - 6 : 0}
                                            </div>
                                        </div>
                                    </Stack>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Users className="w-12 h-12 text-surface-5 mb-4" />
                                        <Text variant="caption">Connect your team to see live vibes.</Text>
                                    </div>
                                )}
                            </Stack>
                        </GlassSurface>
                    </motion.div>
                </div>

                {/* Organization Metrics (Manager View) */}
                {metrics.team && (
                    <motion.div variants={itemReveal}>
                        <Text variant="h3" className="mb-6 pl-2 border-l-4 border-accent-secondary">Organization Health</Text>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <GlassSurface intensity="light" className="p-6">
                                <Stack gap={2}>
                                    <Users className="w-5 h-5 text-accent-secondary" />
                                    <Text variant="h2" gradient="neutral">{metrics.team.activeMembers}</Text>
                                    <Text variant="caption">Active Members</Text>
                                </Stack>
                            </GlassSurface>

                            <GlassSurface intensity="light" className="p-6">
                                <Stack gap={2}>
                                    <ActivityIcon score={metrics.team.avgMood} />
                                    <Text variant="h2" gradient="happy">{metrics.team.avgMood.toFixed(1)}</Text>
                                    <Text variant="caption">Team Mood</Text>
                                </Stack>
                            </GlassSurface>

                            <GlassSurface intensity="light" className="p-6">
                                <Stack gap={2}>
                                    <div className="w-5 h-5 rounded-full bg-emo-energized shadow-[0_0_10px_var(--emo-energized-glow)]" />
                                    <Text variant="h2" gradient="energized">{metrics.team.avgEnergy.toFixed(1)}</Text>
                                    <Text variant="caption">Team Energy</Text>
                                </Stack>
                            </GlassSurface>

                            <GlassSurface intensity="light" className="p-6 interactive" onClick={() => router.push('/analytics')}>
                                <Stack gap={2} className="h-full justify-center items-center">
                                    <TrendingUp className="w-8 h-8 text-text-tertiary mb-2" />
                                    <Text variant="body-sm" className="font-medium text-accent-primary">View Full Analytics</Text>
                                </Stack>
                            </GlassSurface>
                        </div>
                    </motion.div>
                )}
            </Stack>
        </motion.div>
    );
}
