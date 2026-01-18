'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingDown, TrendingUp, Activity, AlertCircle } from 'lucide-react';

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
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!data || data.personal.recentEntries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <AlertCircle className="w-16 h-16 text-gray-600 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Not Enough Data</h2>
                <p className="text-gray-400">Complete more check-ins to see your analytics</p>
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

    const getBurnoutStatus = (risk: number) => {
        if (risk < 30) return { label: 'Low Risk', color: 'text-green-400', icon: TrendingDown };
        if (risk < 60) return { label: 'Moderate Risk', color: 'text-yellow-400', icon: Activity };
        return { label: 'High Risk', color: 'text-red-400', icon: TrendingUp };
    };

    const burnoutStatus = getBurnoutStatus(data.personal.burnoutRisk);
    const StatusIcon = burnoutStatus.icon;

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-bold mb-2">Analytics</h1>
                <p className="text-gray-400">Deep dive into your emotional wellness trends</p>
            </header>

            {/* Burnout Risk Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Burnout Risk Score</h2>
                        <p className="text-gray-400">Calculated using the PRD algorithm</p>
                    </div>
                    <div className={`flex items-center gap-2 ${burnoutStatus.color}`}>
                        <StatusIcon className="w-6 h-6" />
                        <span className="font-semibold">{burnoutStatus.label}</span>
                    </div>
                </div>

                <div className="flex items-end gap-4">
                    <div className={`text-7xl font-black ${burnoutStatus.color}`}>
                        {data.personal.burnoutRisk}%
                    </div>
                    <div className="mb-4 text-gray-400">
                        <p className="text-sm">Formula:</p>
                        <p className="text-xs font-mono">(Stress × 0.5) + (Exhaustion × 0.3) + (Volatility × 0.2)</p>
                    </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-white/5">
                    <p className="text-sm text-gray-300">
                        {data.personal.burnoutRisk < 30 && "You're doing great! Keep maintaining healthy work-life balance."}
                        {data.personal.burnoutRisk >= 30 && data.personal.burnoutRisk < 60 && "Consider taking breaks and managing stress levels."}
                        {data.personal.burnoutRisk >= 60 && "⚠️ High burnout risk detected. Please prioritize self-care and consider speaking with your manager."}
                    </p>
                </div>
            </motion.div>

            {/* Mood Trends Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
                <h3 className="text-2xl font-bold mb-6">Mood, Energy & Stress Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="date" stroke="#888" />
                        <YAxis stroke="#888" domain={[0, 10]} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1a1a2e',
                                border: '1px solid #ffffff20',
                                borderRadius: '12px',
                            }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Mood" />
                        <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Energy" />
                        <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Stress" />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Burnout Risk Over Time */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
                <h3 className="text-2xl font-bold mb-6">Burnout Risk Timeline</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="burnoutGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="date" stroke="#888" />
                        <YAxis stroke="#888" domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1a1a2e',
                                border: '1px solid #ffffff20',
                                borderRadius: '12px',
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="burnout"
                            stroke="#ef4444"
                            strokeWidth={2}
                            fill="url(#burnoutGradient)"
                            name="Burnout Risk %"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InsightCard
                    title="Average Mood"
                    value={data.personal.avgMood.toFixed(1)}
                    max={10}
                    trend={data.personal.avgMood > 6 ? 'up' : 'down'}
                    color="blue"
                />
                <InsightCard
                    title="Average Energy"
                    value={data.personal.avgEnergy.toFixed(1)}
                    max={10}
                    trend={data.personal.avgEnergy > 6 ? 'up' : 'down'}
                    color="green"
                />
                <InsightCard
                    title="Average Stress"
                    value={data.personal.avgStress.toFixed(1)}
                    max={10}
                    trend={data.personal.avgStress < 5 ? 'up' : 'down'}
                    color="amber"
                />
            </div>
        </div>
    );
}

function InsightCard({ title, value, max, trend, color }: {
    title: string;
    value: string;
    max: number;
    trend: 'up' | 'down';
    color: string;
}) {
    const percentage = (parseFloat(value) / max) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-gray-400">{title}</h4>
                {trend === 'up' ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                )}
            </div>
            <div className="text-4xl font-bold mb-3">{value}</div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-${color}-500 transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </motion.div>
    );
}
