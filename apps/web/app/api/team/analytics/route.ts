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

        if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        
        const orgUsers = await prisma.user.findMany({
            where: { orgId: user.orgId },
            include: {
                entries: {
                    where: {
                        timestamp: { gte: thirtyDaysAgo }
                    },
                    orderBy: { timestamp: 'desc' },
                }
            }
        });

        const memberStats = orgUsers.map(u => {
            const entries = u.entries;
            const avgMood = entries.length > 0 ? entries.reduce((s: number, e: any) => s + e.moodScore, 0) / entries.length : null;
            const avgStress = entries.length > 0 ? entries.reduce((s: number, e: any) => s + e.stressScore, 0) / entries.length : null;
            const avgEnergy = entries.length > 0 ? entries.reduce((s: number, e: any) => s + e.energyScore, 0) / entries.length : null;

            
            const exhaustion = avgEnergy !== null ? 10 - avgEnergy : 0;
            const risk = (avgStress || 0) * 0.5 + exhaustion * 0.3;
            const riskScore = Math.min(100, (risk / 8) * 100);

            return {
                id: u.id,
                name: u.name,
                role: u.role,
                checkInCount: entries.length,
                avgMood: avgMood !== null ? Math.round(avgMood * 10) / 10 : null,
                riskScore: Math.round(riskScore),
                lastCheckIn: entries[0]?.timestamp || null,
                status: riskScore > 75 ? 'critical' : riskScore > 50 ? 'warning' : 'stable'
            };
        });

        
        const moodDistribution = {
            Energized: memberStats.filter(m => m.avgMood && m.avgMood >= 8).length,
            Happy: memberStats.filter(m => m.avgMood && m.avgMood >= 6 && m.avgMood < 8).length,
            Neutral: memberStats.filter(m => m.avgMood && m.avgMood >= 4 && m.avgMood < 6).length,
            Drained: memberStats.filter(m => m.avgMood && m.avgMood < 4).length,
        };

        return NextResponse.json({
            organization: {
                name: "Your Organization",
                memberCount: orgUsers.length,
                activeMembers: memberStats.filter(m => m.checkInCount > 0).length,
            },
            memberStats,
            moodDistribution
        });
    } catch (error) {
        console.error('Team analytics error:', error);
        return NextResponse.json({ error: 'Failed to fetch team analytics' }, { status: 500 });
    }
}
