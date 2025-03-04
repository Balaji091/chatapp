import express from "express";
import { upload } from "../middlewares/multer.js"; // Import multer config
import { updateProfile } from "../controllers/profile.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

// Profile image upload route (using Multer middleware)
router.put("/update-profile",protectRoute,upload.single('image'), updateProfile);

export default router;
