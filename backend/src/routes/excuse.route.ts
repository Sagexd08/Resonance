/**
 * Excuse Route - Meeting excuse email generation.
 */
import { Router } from "express";
import { generateExcuse } from "../controllers/excuse.controller.js";

const router = Router();

/**
 * POST /api/generate-excuse
 * Generate a professional meeting excuse email.
 * 
 * Body:
 * - meetingName: string
 * - managerName: string
 */
router.post("/", generateExcuse);

export default router;
