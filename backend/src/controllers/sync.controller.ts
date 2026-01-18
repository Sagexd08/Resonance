/**
 * Sync Controller - Handles biometric data sync and FlowScore calculation.
 */
import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { analyzeBiometrics } from "../services/MLService.js";

/**
 * Calculate FlowScore from fatigue and stress scores.
 * Formula: 100 - ((fatigue * 50) + (stress * 50))
 */
function calculateFlowScore(fatigue: number, stress: number): number {
  return Math.max(0, Math.min(100, 100 - (fatigue * 50 + stress * 50)));
}

/**
 * Generate coach message based on FlowScore.
 */
function getCoachMessage(flowScore: number, fatigue: number, stress: number): string {
  if (flowScore < 30) {
    return "High stress and fatigue detected. Consider taking a break and blocking your calendar.";
  } else if (flowScore < 50) {
    return "Elevated stress levels detected. Try some deep breathing exercises or a short walk.";
  } else if (flowScore < 70) {
    return "You're doing well. Consider scheduling focused work blocks to maintain productivity.";
  } else {
    return "Great flow state! Keep up the momentum.";
  }
}

export async function syncBiometrics(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const audioFile = files?.["audioFile"]?.[0];
    const imageFile = files?.["imageFile"]?.[0];

    
    if (!userId) {
      res.status(400).json({ error: "userId is required" });
      return;
    }

    if (!audioFile || !imageFile) {
      res.status(400).json({ error: "Both audioFile and imageFile are required" });
      return;
    }

    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    
    const analysis = await analyzeBiometrics(audioFile.buffer, imageFile.buffer);

    
    const flowScore = calculateFlowScore(analysis.fatigue, analysis.stress);

    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const dailyMetric = await prisma.dailyMetric.create({
      data: {
        userId,
        date: today,
        flowScore,
        fatigueScore: analysis.fatigue,
        voiceStress: analysis.stress,
        meetingCount: 0, 
      },
    });

    
    const coachMessage = getCoachMessage(flowScore, analysis.fatigue, analysis.stress);

    res.json({
      success: true,
      flowScore,
      fatigueScore: analysis.fatigue,
      stressScore: analysis.stress,
      coachMessage,
      metricId: dailyMetric.id,
    });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({
      error: "Failed to sync biometrics",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
