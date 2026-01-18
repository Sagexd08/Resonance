/**
 * Manager Controller - Handles manager dashboard and burnout alerts.
 */
import { Request, Response } from "express";
import prisma from "../db/prisma.js";

/**
 * Get team heatmap data (last 7 days).
 * Returns team-level aggregates only (privacy: no individual user data).
 */
export async function getTeamHeatmap(req: Request, res: Response): Promise<void> {
  try {
    const { teamId } = req.query;

    if (!teamId || typeof teamId !== "string") {
      res.status(400).json({ error: "teamId query parameter is required" });
      return;
    }

    
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        users: {
          select: {
            id: true, 
          },
        },
      },
    });

    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }

    
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    
    const userIds = team.users.map((u) => u.id);
    const metrics = await prisma.dailyMetric.findMany({
      where: {
        userId: { in: userIds },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    
    const dailyAverages: Record<string, { flowScore: number; count: number }> = {};

    for (const metric of metrics) {
      const dateKey = metric.date.toISOString().split("T")[0];
      if (!dailyAverages[dateKey]) {
        dailyAverages[dateKey] = { flowScore: 0, count: 0 };
      }
      dailyAverages[dateKey].flowScore += metric.flowScore;
      dailyAverages[dateKey].count += 1;
    }

    
    const teamAverage =
      metrics.length > 0
        ? metrics.reduce((sum, m) => sum + m.flowScore, 0) / metrics.length
        : 0;

    
    const heatmapData = Object.entries(dailyAverages).map(([date, data]) => ({
      date,
      averageFlowScore: data.count > 0 ? data.flowScore / data.count : 0,
      sampleCount: data.count,
    }));

    
    if (teamAverage < 50 && metrics.length > 0) {
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingAlert = await prisma.burnoutAlert.findFirst({
        where: {
          teamId,
          createdAt: {
            gte: today,
          },
        },
      });

      if (!existingAlert) {
        
        let severity: "LOW" | "MED" | "HIGH" = "LOW";
        if (teamAverage < 30) {
          severity = "HIGH";
        } else if (teamAverage < 40) {
          severity = "MED";
        }

        await prisma.burnoutAlert.create({
          data: {
            teamId,
            severity,
            reason: `Team average FlowScore (${teamAverage.toFixed(1)}) below threshold (50)`,
          },
        });
      }
    }

    res.json({
      teamId: team.id,
      teamName: team.name,
      companyName: team.companyName,
      teamAverageFlowScore: teamAverage,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      dailyAverages: heatmapData,
      totalSamples: metrics.length,
    });
  } catch (error) {
    console.error("Manager heatmap error:", error);
    res.status(500).json({
      error: "Failed to fetch team heatmap",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
