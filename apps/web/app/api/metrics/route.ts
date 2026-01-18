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

        // Get user's recent entries (last 30 days)
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

        // Calculate personal metrics
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

        // Burnout Risk Algorithm (from PRD)
        // Risk = (AverageStress * 0.5) + (AverageExhaustion * 0.3) + (Volatility * 0.2)
        const exhaustion = 10 - avgEnergy; // Invert energy to get exhaustion

        // Calculate volatility (standard deviation of mood)
        const moodMean = avgMood;
        const moodVariance = entries.length > 0
            ? entries.reduce((sum, e) => sum + Math.pow(e.moodScore - moodMean, 2), 0) / entries.length
            : 0;
        const volatility = Math.sqrt(moodVariance);

        const burnoutRisk = (avgStress * 0.5) + (exhaustion * 0.3) + (volatility * 0.2);
        const burnoutPercentage = Math.min(100, (burnoutRisk / 10) * 100);

        // Get team metrics if user is a manager
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
                include: {
                    user: true,
                },
            });

            const teamAvgMood = orgEntries.length > 0
                ? orgEntries.reduce((sum, e) => sum + e.moodScore, 0) / orgEntries.length
                : 0;

            const teamAvgEnergy = orgEntries.length > 0
                ? orgEntries.reduce((sum, e) => sum + e.energyScore, 0) / orgEntries.length
                : 0;

            const uniqueUsers = new Set(orgEntries.map(e => e.userId)).size;

            teamMetrics = {
                avgMood: teamAvgMood,
                avgEnergy: teamAvgEnergy,
                activeMembers: uniqueUsers,
                totalCheckIns: orgEntries.length,
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
            },
            team: teamMetrics,
        });
    } catch (error) {
        console.error('Dashboard metrics error:', error);
        return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
    }
}
