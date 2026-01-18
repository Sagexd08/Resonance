import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const entries = await prisma.emotionalEntry.findMany({
            where: {
                userId: user.id,
                timestamp: {
                    gte: thirtyDaysAgo,
                },
            },
            orderBy: {
                timestamp: 'desc',
            },
            take: 30,
        });

        
        const totalEntries = entries.length;
        const avgMood = entries.length > 0
            ? entries.reduce((sum, e) => sum + e.moodScore, 0) / entries.length
            : 0;
        const avgEnergy = entries.length > 0
            ? entries.reduce((sum, e) => sum + e.energyScore, 0) / entries.length
            : 0;
        const avgStress = entries.length > 0
            ? entries.reduce((sum, e) => sum + e.stressScore, 0) / entries.length
            : 0;

        
        const exhaustion = 10 - avgEnergy;

        
        const moodMean = avgMood;
        const moodVariance = entries.length > 0
            ? entries.reduce((sum, e) => sum + Math.pow(e.moodScore - moodMean, 2), 0) / entries.length
            : 0;
        const volatility = Math.sqrt(moodVariance);

        const burnoutRisk = (avgStress * 0.5) + (exhaustion * 0.3) + (volatility * 0.2);
        const burnoutPercentage = Math.min(100, (burnoutRisk / 10) * 100);

        
        const insights = [];
        if (burnoutPercentage > 60) {
            insights.push({
                type: 'critical',
                text: "High burnout risk detected. Shift into low-power mode and prioritize recovery.",
                icon: 'ShieldAlert'
            });
        } else if (avgStress > 7) {
            insights.push({
                type: 'warning',
                text: "Your stress load is elevated. Consider delegating high-intensity tasks today.",
                icon: 'AlertCircle'
            });
        }

        if (avgEnergy > 7) {
            insights.push({
                type: 'positive',
                text: "Energy levels are optimal. Great time for deep-focus creative work.",
                icon: 'Zap'
            });
        }

        if (entries.length < 3) {
            insights.push({
                type: 'neutral',
                text: "Keep checking in daily to sharpen your neural insights.",
                icon: 'Sparkles'
            });
        }

        
        let teamMetrics = null;
        if (user.role === 'MANAGER' || user.role === 'ADMIN') {
            const orgEntries = await prisma.emotionalEntry.findMany({
                where: {
                    user: {
                        orgId: user.orgId,
                    },
                    timestamp: {
                        gte: thirtyDaysAgo,
                    },
                },
                orderBy: {
                    timestamp: 'desc'
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            role: true
                        }
                    },
                },
            });

            const teamAvgMood = orgEntries.length > 0
                ? orgEntries.reduce((sum, e) => sum + e.moodScore, 0) / orgEntries.length
                : 0;

            const teamAvgEnergy = orgEntries.length > 0
                ? orgEntries.reduce((sum, e) => sum + e.energyScore, 0) / orgEntries.length
                : 0;

            const uniqueUsers = new Set(orgEntries.map(e => e.userId)).size;

            
            const recentActivity = orgEntries.slice(0, 5).map(e => ({
                userId: e.userId.substring(0, 4), 
                timestamp: e.timestamp,
                mood: e.moodScore > 7 ? 'happy' : e.moodScore < 4 ? 'drained' : 'neutral'
            }));

            teamMetrics = {
                avgMood: teamAvgMood,
                avgEnergy: teamAvgEnergy,
                activeMembers: uniqueUsers,
                totalCheckIns: orgEntries.length,
                recentActivity
            };
        }

        return NextResponse.json({
            personal: {
                totalCheckIns: totalEntries,
                avgMood: Math.round(avgMood * 10) / 10,
                avgEnergy: Math.round(avgEnergy * 10) / 10,
                avgStress: Math.round(avgStress * 10) / 10,
                burnoutRisk: Math.round(burnoutPercentage),
                recentEntries: entries.slice(0, 7).map(e => ({
                    date: e.timestamp,
                    mood: e.moodScore,
                    energy: e.energyScore,
                    stress: e.stressScore,
                })),
                insights: insights.length > 0 ? insights : [
                    { type: 'neutral', text: "Resonance flow is stable. Continue your mindfulness practice.", icon: 'Activity' }
                ]
            },
            team: teamMetrics,
        });
    } catch (error) {
        console.error('Dashboard metrics error:', error);
        return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
    }
}
