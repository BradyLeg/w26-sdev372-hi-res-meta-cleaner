import { Router } from "express";
import multer from "multer";
import { updateMetadata, uploadAudio } from "../controllers/controllers.js";

// Initialize Express router
const router = Router();

const upload = multer({ dest: "uploads/" });

// fake user id for testing
function fakeAuth(req, res, next) {
  req.user = { user_id: 1 };
  next();
}

//routes

router.post("/api/upload", fakeAuth, upload.array("files"), uploadAudio);
router.post("/api/update", updateMetadata);

// Export the configured router for use in the main application
export default router;
