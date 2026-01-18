'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
    TrendingDown, TrendingUp, Activity, AlertCircle,
    ChevronLeft, Sparkles, Brain, Zap, ShieldAlert
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Stack } from '../../../components/primitives/Stack';
import { Text } from '../../../components/primitives/Text';
import { GlassSurface } from '../../../components/primitives/GlassSurface';
import { Button } from '../../../components/ui/Button';
import {
    containerReveal, itemReveal, fadeIn,
    transitionMedium, floating
} from '../../../lib/motion/transitions';

interface AnalyticsData {
    personal: {
        totalCheckIns: number;
        avgMood: number;
        avgEnergy: number;
        avgStress: number;
        burnoutRisk: number;
        recentEntries: Array<{
            date: string;
            mood: number;
            energy: number;
            stress: number;
        }>;
    };
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/metrics');
            if (!response.ok) throw new Error('Failed to fetch');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-bg-primary">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Brain className="w-8 h-8 text-accent-primary" />
                </motion.div>
            </div>
        );
    }

    if (!data || data.personal.recentEntries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary text-center px-6">
                <GlassSurface intensity="medium" className="p-12 max-w-lg">
                    <Stack gap={6} align="center">
                        <ShieldAlert className="w-16 h-16 text-text-tertiary" />
                        <Stack gap={2}>
                            <Text variant="h2">Insufficient Resonance</Text>
                            <Text variant="body" className="text-text-secondary">
                                We need more data to analyze your emotional frequency. Complete at least one check-in.
                            </Text>
                        </Stack>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => router.push('/check-in')}
                        >
                            Complete First Check-in
                        </Button>
                    </Stack>
                </GlassSurface>
            </div>
        );
    }

    // Transform data for charts
    const chartData = data.personal.recentEntries
        .slice()
        .reverse()
        .map(entry => ({
            date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            mood: entry.mood,
            energy: entry.energy,
            stress: entry.stress,
            burnout: ((entry.stress * 0.5) + ((10 - entry.energy) * 0.3)) / 10 * 100,
        }));

    const riskLevel =
        data.personal.burnoutRisk < 30 ? "low" :
            data.personal.burnoutRisk < 60 ? "moderate" :
                "high";

    const riskConfig = {
        low: { label: 'Optimal', color: '#10B981', gradient: 'happy', icon: TrendingDown },
        moderate: { label: 'Moderate', color: '#F59E0B', gradient: 'energized', icon: Activity },
        high: { label: 'Critical', color: '#EF4444', gradient: 'burnout', icon: TrendingUp },
    }[riskLevel];

    return (
        <motion.div
            variants={containerReveal}
            initial="initial"
            animate="animate"
            className="w-full max-w-7xl mx-auto p-6 md:p-12"
        >
            <Stack gap={10}>
                {/* Header */}
                <motion.div variants={itemReveal}>
                    <Stack gap={4}>
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<ChevronLeft className="w-4 h-4" />}
                            onClick={() => router.push('/dashboard')}
                        >
                            Back to Pulse
                        </Button>
                        <Stack gap={1}>
                            <Text variant="display" className="text-5xl">Neural <span className="text-accent-primary">Insights</span></Text>
                            <Text variant="body-lg" className="text-text-secondary">Systemic analysis of your emotional wellness trajectory.</Text>
                        </Stack>
                    </Stack>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Burnout Analysis (Hero Section) */}
                    <motion.div variants={itemReveal} className="lg:col-span-2">
                        <motion.div
                            variants={floating}
                            animate="animate"
                        >
                            <GlassSurface intensity="heavy" className="p-8 h-full relative group">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl -z-10" />

                                <Stack gap={8}>
                                    <Stack direction="row" justify="between" align="center">
                                        <Text variant="h3">Vitality Trajectory</Text>
                                        <riskConfig.icon className="w-6 h-6" style={{ color: riskConfig.color }} />
                                    </Stack>

                                    <div className="flex flex-col md:flex-row items-end gap-8">
                                        <Stack gap={2}>
                                            <Text variant="micro" className="text-text-tertiary">Current Risk Level</Text>
                                            <Text variant="display" gradient={riskConfig.gradient as any} className="text-7xl leading-none">
                                                {data.personal.burnoutRisk}%
                                            </Text>
                                            <Text variant="body" className="font-semibold" style={{ color: riskConfig.color }}>
                                                {riskConfig.label} Risk Detected
                                            </Text>
                                        </Stack>

                                        <GlassSurface intensity="light" className="p-4 flex-1">
                                            <Stack gap={3}>
                                                <Text variant="caption">AI Interpretation</Text>
                                                <Text variant="body-sm" className="italic text-text-secondary leading-relaxed">
                                                    "{data.personal.burnoutRisk < 30 ?
                                                        "Systemic resonance is high. Your energy flow is optimized for peak performance." :
                                                        data.personal.burnoutRisk < 60 ?
                                                            "Minor fluctuations detected in your stress/exhaustion ratio. Consider a 15-minute mindfulness session." :
                                                            "Critical delta between stress and recovery. High risk of burnout. Shift into low-power mode immediately."
                                                    }"
                                                </Text>
                                            </Stack>
                                        </GlassSurface>
                                    </div>

                                    {/* Timeline Chart */}
                                    <GlassSurface intensity="light" className="p-6 h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="burnoutGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={riskConfig.color} stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor={riskConfig.color} stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="date" hide />
                                                <YAxis hide domain={[0, 100]} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="burnout"
                                                    stroke={riskConfig.color}
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#burnoutGradient)"
                                                    animationDuration={1500}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </GlassSurface>
                                </Stack>
                            </GlassSurface>
                        </motion.div>
                    </motion.div>

                    {/* Stats Sidebar */}
                    <motion.div variants={itemReveal}>
                        <Stack gap={6}>
                            <InsightCard
                                icon={<Activity className="text-accent-primary" />}
                                title="Average Mood"
                                value={data.personal.avgMood.toFixed(1)}
                                gradient="happy"
                            />
                            <InsightCard
                                icon={<Zap className="text-emo-energized" />}
                                title="Energy Flow"
                                value={data.personal.avgEnergy.toFixed(1)}
                                gradient="energized"
                            />
                            <InsightCard
                                icon={<AlertCircle className="text-emo-burnout" />}
                                title="Stress Load"
                                value={data.personal.avgStress.toFixed(1)}
                                gradient="burnout"
                            />
                        </Stack>
                    </motion.div>
                </div>

                {/* Secondary Chart Section */}
                <motion.div variants={itemReveal}>
                    <GlassSurface intensity="medium" className="p-8">
                        <Stack gap={6}>
                            <Text variant="h3">Emotional Correlation</Text>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-5)" vertical={false} />
                                        <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}
                                        />
                                        <Legend verticalAlign="top" height={36} />
                                        <Line type="monotone" dataKey="mood" stroke="var(--emo-happy-base)" strokeWidth={3} dot={false} name="Mood" animationDuration={2000} />
                                        <Line type="monotone" dataKey="energy" stroke="var(--emo-energized-base)" strokeWidth={3} dot={false} name="Energy" animationDuration={2000} />
                                        <Line type="monotone" dataKey="stress" stroke="var(--emo-burnout-base)" strokeWidth={3} dot={false} name="Stress" animationDuration={2000} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Stack>
                    </GlassSurface>
                </motion.div>
            </Stack>
        </motion.div>
    );
}

function InsightCard({ icon, title, value, gradient }: {
    icon: React.ReactNode,
    title: string,
    value: string,
    gradient: any
}) {
    return (
        <GlassSurface intensity="light" className="p-6 hover:shadow-glow-soft hover:bg-white/5 transition-all">
            <Stack gap={4}>
                <div className="flex items-center gap-3">
                    {icon}
                    <Text variant="caption">{title}</Text>
                </div>
                <Text variant="h1" gradient={gradient} className="text-5xl font-black">
                    {value}
                </Text>
            </Stack>
        </GlassSurface>
    );
}
