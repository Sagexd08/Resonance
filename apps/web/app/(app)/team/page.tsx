'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users, TrendingUp, AlertTriangle, ShieldCheck,
    ArrowRight, Search, Filter, Mail, MessageSquare
} from 'lucide-react';
import { useRouter } from 'next/navigation';


import { Stack } from '../../../components/primitives/Stack';
import { Text } from '../../../components/primitives/Text';
import { GlassSurface } from '../../../components/primitives/GlassSurface';
import { Button } from '../../../components/ui/Button';
import { containerReveal, itemReveal, fadeIn } from '../../../lib/motion/transitions';

interface TeamData {
    organization: {
        name: string;
        memberCount: number;
        activeMembers: number;
    };
    memberStats: Array<{
        id: string;
        name: string;
        role: string;
        checkInCount: number;
        avgMood: number | null;
        riskScore: number;
        lastCheckIn: string | null;
        status: 'critical' | 'warning' | 'stable';
    }>;
    moodDistribution: {
        Energized: number;
        Happy: number;
        Neutral: number;
        Drained: number;
    };
}

export default function TeamDashboard() {
    const [data, setData] = useState<TeamData | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/team/analytics');
            if (!response.ok) throw new Error('Unauthorized or failed to fetch');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error:', error);
            router.push('/dashboard'); 
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null; 

    const filteredMembers = data?.memberStats.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const criticalMembers = data?.memberStats.filter(m => m.status === 'critical') || [];

    return (
        <motion.div
            variants={containerReveal}
            initial="initial"
            animate="animate"
            className="w-full max-w-7xl mx-auto p-6 md:p-12"
        >
            <Stack gap={10}>
                {}
                <motion.div variants={itemReveal}>
                    <Stack direction="row" justify="between" align="end">
                        <Stack gap={1}>
                            <Text variant="display" className="text-5xl">Team <span className="text-accent-secondary">Pulse</span></Text>
                            <Text variant="body-lg" className="text-text-secondary">Holistic organizational health monitoring.</Text>
                        </Stack>
                        <Stack direction="row" gap={3}>
                            <Button variant="glass" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
                            <Button variant="primary" size="sm">Export Report</Button>
                        </Stack>
                    </Stack>
                </motion.div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div variants={itemReveal}>
                        <GlassSurface intensity="medium" className="p-6 border-l-4 border-accent-primary">
                            <Stack gap={2}>
                                <Text variant="caption">Total Members</Text>
                                <Text variant="h1">{data?.organization.memberCount}</Text>
                                <Text variant="micro" className="text-text-tertiary">
                                    {data?.organization.activeMembers} active contributors (30d)
                                </Text>
                            </Stack>
                        </GlassSurface>
                    </motion.div>

                    <motion.div variants={itemReveal}>
                        <GlassSurface intensity="medium" className="p-6 border-l-4 border-emo-burnout">
                            <Stack gap={2}>
                                <Text variant="caption">Critical Interventions</Text>
                                <Text variant="h1" className="text-emo-burnout">{criticalMembers.length}</Text>
                                <Text variant="micro" className="text-text-tertiary">Proactive support recommended</Text>
                            </Stack>
                        </GlassSurface>
                    </motion.div>

                    <motion.div variants={itemReveal}>
                        <GlassSurface intensity="medium" className="p-6 border-l-4 border-emo-happy">
                            <Stack gap={2}>
                                <Text variant="caption">Org Resonance</Text>
                                <Text variant="h1" gradient="happy">84%</Text>
                                <Text variant="micro" className="text-text-tertiary">Stabilizing upwards (+5% vs last week)</Text>
                            </Stack>
                        </GlassSurface>
                    </motion.div>
                </div>

                {}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {}
                    <motion.div variants={itemReveal} className="lg:col-span-2">
                        <GlassSurface intensity="medium" className="p-8 h-full">
                            <Stack gap={8}>
                                <Stack direction="row" justify="between" align="center">
                                    <Text variant="h3">Member Trajectories</Text>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                                        <input
                                            type="text"
                                            placeholder="Search members..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="bg-surface-2 border border-surface-5 rounded-full py-2 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20 transition-all w-64"
                                        />
                                    </div>
                                </Stack>

                                <div className="space-y-4">
                                    {filteredMembers.map((member) => (
                                        <motion.div
                                            key={member.id}
                                            whileHover={{ scale: 1.01 }}
                                            className="p-4 bg-surface-2/50 rounded-2xl border border-surface-5 flex items-center justify-between group cursor-pointer"
                                        >
                                            <Stack direction="row" align="center" gap={4}>
                                                <div className="w-10 h-10 rounded-full bg-surface-5 flex items-center justify-center font-bold text-accent-secondary">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <Stack gap={0}>
                                                    <Text variant="body" className="font-semibold">{member.name}</Text>
                                                    <Text variant="micro" className="text-text-tertiary">{member.role} • {member.checkInCount} check-ins</Text>
                                                </Stack>
                                            </Stack>

                                            <Stack direction="row" align="center" gap={8}>
                                                <Stack align="end" gap={0}>
                                                    <Text variant="micro" className="text-text-tertiary uppercase">Risk Score</Text>
                                                    <Text
                                                        variant="body"
                                                        className={`font-black ${member.status === 'critical' ? 'text-emo-burnout' :
                                                                member.status === 'warning' ? 'text-emo-energized' : 'text-emo-happy'
                                                            }`}
                                                    >
                                                        {member.riskScore}%
                                                    </Text>
                                                </Stack>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="glass" size="sm" className="p-2"><Mail size={16} /></Button>
                                                    <Button variant="glass" size="sm" className="p-2"><MessageSquare size={16} /></Button>
                                                </div>
                                            </Stack>
                                        </motion.div>
                                    ))}
                                </div>
                            </Stack>
                        </GlassSurface>
                    </motion.div>

                    {}
                    <motion.div variants={itemReveal}>
                        <Stack gap={6}>
                            <GlassSurface intensity="heavy" className="p-6 border-b-4 border-emo-burnout">
                                <Stack gap={6}>
                                    <Stack direction="row" gap={3} align="center">
                                        <AlertTriangle className="text-emo-burnout w-6 h-6" />
                                        <Text variant="h4">Attention Required</Text>
                                    </Stack>
                                    <Text variant="body-sm" className="text-text-secondary">
                                        The following members have shown a 20%+ increase in burnout risk this week.
                                    </Text>
                                    <div className="space-y-3">
                                        {criticalMembers.map(m => (
                                            <div key={m.id} className="p-3 bg-emo-burnout/5 border border-emo-burnout/20 rounded-xl flex items-center justify-between">
                                                <Text variant="body-sm" className="font-medium">{m.name}</Text>
                                                <ArrowRight className="text-emo-burnout w-4 h-4" />
                                            </div>
                                        ))}
                                        {criticalMembers.length === 0 && (
                                            <div className="p-4 text-center border border-dashed border-surface-5 rounded-xl">
                                                <ShieldCheck className="w-8 h-8 text-emo-happy mx-auto mb-2" />
                                                <Text variant="caption">All members are within stable resonance bounds.</Text>
                                            </div>
                                        )}
                                    </div>
                                </Stack>
                            </GlassSurface>

                            <GlassSurface intensity="medium" className="p-6">
                                <Stack gap={4}>
                                    <Text variant="h4">Mood Distribution</Text>
                                    <div className="space-y-4">
                                        {Object.entries(data?.moodDistribution || {}).map(([mood, count]) => (
                                            <Stack key={mood} gap={2}>
                                                <Stack direction="row" justify="between">
                                                    <Text variant="micro">{mood}</Text>
                                                    <Text variant="micro">{count} members</Text>
                                                </Stack>
                                                <div className="h-1.5 bg-surface-5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full bg-emo-${mood.toLowerCase()} transition-all`}
                                                        style={{ width: `${(count / (data?.organization.memberCount || 1)) * 100}%` }}
                                                    />
                                                </div>
                                            </Stack>
                                        ))}
                                    </div>
                                </Stack>
                            </GlassSurface>
                        </Stack>
                    </motion.div>
                </div>
            </Stack>
        </motion.div>
    );
}
