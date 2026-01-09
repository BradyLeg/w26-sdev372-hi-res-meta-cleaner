import { Router } from "express";
import { updateMetaData } from "../controllers/controllers.js";

// Initialize Express router
const router = Router();

//routes

//GET /api/get

// POST /api/update - updates data base with meta data extracted from uploaded audio files
router.post("/api/update", updateMetaData);

// Export the configured router for use in the main application
export default router;
