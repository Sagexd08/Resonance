/**
 * Sync Route - Handles biometric data synchronization.
 */
import { Router } from "express";
import multer from "multer";
import { syncBiometrics } from "../controllers/sync.controller.js";

const router = Router();


const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    
    if (
      file.mimetype.startsWith("audio/") ||
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only audio and image files are allowed."));
    }
  },
});

/**
 * POST /api/sync
 * Sync biometric data (audio + image) and calculate FlowScore.
 * 
 * Body (multipart/form-data):
 * - userId: string
 * - audioFile: File (audio/wav, audio/mpeg, etc.)
 * - imageFile: File (image/jpeg, image/png, etc.)
 */
router.post("/", upload.fields([
  { name: "audioFile", maxCount: 1 },
  { name: "imageFile", maxCount: 1 },
]), syncBiometrics);

export default router;
