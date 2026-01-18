/**
 * Manager Route - Manager dashboard endpoints.
 */
import { Router } from "express";
import { getTeamHeatmap } from "../controllers/manager.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();


router.use(authMiddleware);

/**
 * GET /api/manager/heatmap
 * Get team heatmap data for last 7 days.
 * 
 * Query params:
 * - teamId: string (required)
 * 
 * Returns team-level aggregates only (privacy: no individual user data).
 */
router.get("/heatmap", getTeamHeatmap);

export default router;
