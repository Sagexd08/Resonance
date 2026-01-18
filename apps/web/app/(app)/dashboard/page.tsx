'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Activity, TrendingUp, Users, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardMetrics {
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
    team: {
        avgMood: number;
        avgEnergy: number;
        activeMembers: number;
        totalCheckIns: number;
    } | null;
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
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!metrics) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-400">
                <p>No data available. Complete your first check-in!</p>
            </div>
        );
    }

    const getBurnoutColor = (risk: number) => {
        if (risk < 30) return 'text-green-400';
        if (risk < 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getBurnoutBg = (risk: number) => {
        if (risk < 30) return 'bg-green-500/20';
        if (risk < 60) return 'bg-yellow-500/20';
        return 'bg-red-500/20';
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-bold mb-2">Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}!</h1>
                <p className="text-gray-400">Here's how you're doing</p>
            </header>

            {/* Burnout Risk Alert */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl border ${metrics.personal.burnoutRisk > 60
                        ? 'border-red-500/30 bg-red-500/10'
                        : metrics.personal.burnoutRisk > 30
                            ? 'border-yellow-500/30 bg-yellow-500/10'
                            : 'border-green-500/30 bg-green-500/10'
                    }`}
            >
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${getBurnoutBg(metrics.personal.burnoutRisk)}`}>
                        <AlertTriangle className={`w-6 h-6 ${getBurnoutColor(metrics.personal.burnoutRisk)}`} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">Burnout Risk Assessment</h3>
                        <p className="text-gray-400 mb-3">Based on your recent check-ins</p>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${metrics.personal.burnoutRisk > 60 ? 'bg-red-500' :
                                            metrics.personal.burnoutRisk > 30 ? 'bg-yellow-500' :
                                                'bg-green-500'
                                        }`}
                                    style={{ width: `${metrics.personal.burnoutRisk}%` }}
                                />
                            </div>
                            <span className={`text-2xl font-bold ${getBurnoutColor(metrics.personal.burnoutRisk)}`}>
                                {metrics.personal.burnoutRisk}%
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Personal Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<Activity className="w-6 h-6 text-blue-400" />}
                    label="Avg Mood"
                    value={metrics.personal.avgMood.toFixed(1)}
                    max={10}
                    color="blue"
                />
                <StatCard
                    icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
                    label="Avg Energy"
                    value={metrics.personal.avgEnergy.toFixed(1)}
                    max={10}
                    color="emerald"
                />
                <StatCard
                    icon={<AlertTriangle className="w-6 h-6 text-amber-400" />}
                    label="Avg Stress"
                    value={metrics.personal.avgStress.toFixed(1)}
                    max={10}
                    color="amber"
                />
            </div>

            {/* Team Metrics (if manager) */}
            {metrics.team && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Users className="w-6 h-6 text-purple-400" />
                        <h2 className="text-2xl font-bold">Team Pulse</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Team Mood</p>
                            <p className="text-3xl font-bold">{metrics.team.avgMood.toFixed(1)}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Team Energy</p>
                            <p className="text-3xl font-bold">{metrics.team.avgEnergy.toFixed(1)}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Active Members</p>
                            <p className="text-3xl font-bold">{metrics.team.activeMembers}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Total Check-ins</p>
                            <p className="text-3xl font-bold">{metrics.team.totalCheckIns}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-4">
                <button
                    onClick={() => router.push('/check-in')}
                    className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition-transform"
                >
                    Daily Check-in
                </button>
                <button
                    onClick={() => router.push('/analytics')}
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                    View Analytics
                </button>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, max, color }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    max: number;
    color: string;
}) {
    const percentage = (parseFloat(value) / max) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-${color}-500/20`}>
                    {icon}
                </div>
                <span className="text-gray-400">{label}</span>
            </div>
            <div className="text-4xl font-bold mb-2">{value}</div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-${color}-500 transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </motion.div>
    );
}
