import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Resolver('Team')
export class TeamResolver {
    constructor(private readonly prisma: PrismaService) { }

    @Query('teamHeatmap')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('MANAGER', 'ADMIN')
    async teamHeatmap(
        @Args('period') period: string,
        @Context('req') req: any,
    ) {
        const orgId = req.user?.orgId;

        // Get all users in the organization
        const users = await this.prisma.user.findMany({
            where: { orgId },
            select: { id: true, name: true },
        });

        // Get aggregated metrics per user for the period
        const heatmapData = await Promise.all(
            users.map(async (user) => {
                const entries = await this.prisma.emotionalEntry.findMany({
                    where: {
                        userId: user.id,
                        timestamp: {
                            gte: new Date(`${period}-01`),
                        },
                    },
                });

                if (entries.length === 0) {
                    return {
                        userId: user.id,
                        userName: user.name,
                        avgMood: null,
                        avgEnergy: null,
                        avgStress: null,
                        entryCount: 0,
                    };
                }

                const avgMood = entries.reduce((sum, e) => sum + e.moodScore, 0) / entries.length;
                const avgEnergy = entries.reduce((sum, e) => sum + e.energyScore, 0) / entries.length;
                const avgStress = entries.reduce((sum, e) => sum + e.stressScore, 0) / entries.length;

                return {
                    userId: user.id,
                    userName: user.name,
                    avgMood: Math.round(avgMood * 10) / 10,
                    avgEnergy: Math.round(avgEnergy),
                    avgStress: Math.round(avgStress),
                    entryCount: entries.length,
                };
            })
        );

        return heatmapData;
    }

    @Query('teamMetrics')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('MANAGER', 'ADMIN')
    async teamMetrics(
        @Args('period') period: string,
        @Context('req') req: any,
    ) {
        const orgId = req.user?.orgId;

        const metrics = await this.prisma.teamMetrics.findFirst({
            where: { orgId, period },
            orderBy: { period: 'desc' },
        });

        if (!metrics) {
            // Calculate on the fly if not pre-computed
            const entries = await this.prisma.emotionalEntry.findMany({
                where: {
                    user: { orgId },
                    timestamp: {
                        gte: new Date(`${period}-01`),
                    },
                },
            });

            if (entries.length === 0) {
                return {
                    avgMood: 0,
                    burnoutIndex: 0,
                    engagementIndex: 0,
                    period,
                };
            }

            const avgMood = entries.reduce((sum, e) => sum + e.moodScore, 0) / entries.length;
            const avgStress = entries.reduce((sum, e) => sum + e.stressScore, 0) / entries.length;
            const avgEnergy = entries.reduce((sum, e) => sum + e.energyScore, 0) / entries.length;

            // Simple burnout calculation: high stress + low energy
            const burnoutIndex = (avgStress / 100) * 50 + ((100 - avgEnergy) / 100) * 50;

            // Simple engagement: inverse of burnout with mood factor
            const engagementIndex = 100 - burnoutIndex * 0.5 + (avgMood / 5) * 25;

            return {
                avgMood: Math.round(avgMood * 10) / 10,
                burnoutIndex: Math.round(burnoutIndex * 10) / 10,
                engagementIndex: Math.min(100, Math.round(engagementIndex * 10) / 10),
                period,
            };
        }

        return metrics;
    }

    @Query('teamCorrelations')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('MANAGER', 'ADMIN')
    async teamCorrelations(
        @Args('startDate') startDate: string,
        @Args('endDate') endDate: string,
        @Context('req') req: any,
    ) {
        const orgId = req.user?.orgId;

        const entries = await this.prisma.emotionalEntry.findMany({
            where: {
                user: { orgId },
                timestamp: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            orderBy: { timestamp: 'asc' },
        });

        // Group by date
        const dailyData: Record<string, { mood: number[]; energy: number[]; stress: number[] }> = {};

        entries.forEach((entry) => {
            const date = entry.timestamp.toISOString().split('T')[0];
            if (!dailyData[date]) {
                dailyData[date] = { mood: [], energy: [], stress: [] };
            }
            dailyData[date].mood.push(entry.moodScore);
            dailyData[date].energy.push(entry.energyScore);
            dailyData[date].stress.push(entry.stressScore);
        });

        // Calculate daily averages
        const correlations = Object.entries(dailyData).map(([date, data]) => ({
            date,
            avgMood: data.mood.reduce((a, b) => a + b, 0) / data.mood.length,
            avgEnergy: data.energy.reduce((a, b) => a + b, 0) / data.energy.length,
            avgStress: data.stress.reduce((a, b) => a + b, 0) / data.stress.length,
            sampleSize: data.mood.length,
        }));

        return correlations;
    }
}
