/**
 * Excuse Controller - Generates professional meeting excuse emails.
 */
import { Request, Response } from "express";
import { generateExcuseEmail } from "../services/EmailService.js";

export async function generateExcuse(req: Request, res: Response): Promise<void> {
  try {
    const { meetingName, managerName } = req.body;

    if (!meetingName || !managerName) {
      res.status(400).json({
        error: "Both meetingName and managerName are required",
      });
      return;
    }

    const email = await generateExcuseEmail({
      meetingName: String(meetingName),
      managerName: String(managerName),
    });

    res.json({
      success: true,
      email,
      meetingName,
      managerName,
    });
  } catch (error) {
    console.error("Excuse generation error:", error);
    res.status(500).json({
      error: "Failed to generate excuse email",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
