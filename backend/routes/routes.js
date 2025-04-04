import express from "express";

//? Importing Controllers ?//
import {
  signupController,
  loginController,
  saveController,
  getSavedController,
  getSingleSavedController,
  deleteSavedController,
  updateSavedController,
} from "../controller/controller.js";

//? Importing Multer Middleware ?//
import { upload } from "../controller/controller.js";

import { requireAuth } from "../middleware/auth.js";

//? Middleware to verify project ownership ?//
export const verifyOwnership = async (req, res, next) => {
  try {
    const project = await saveModel.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.userId.toString() !== req.session.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const routes = express.Router();

routes.post("/signup", upload.single("profileImage"), signupController);

routes.post("/login", loginController);

routes.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // Or your session cookie name
    res.status(200).json({ message: "Logged out successfully" });
  });
});

routes.post("/save", requireAuth, saveController);

routes.get("/savedCode", getSavedController);

routes.get("/savedCode/:id", requireAuth, getSingleSavedController);

routes.delete("/savedCode/:id", verifyOwnership, deleteSavedController);

routes.patch("/savedCode/:id", verifyOwnership, updateSavedController);

export default routes;
