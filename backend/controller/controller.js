import bcrypt from "bcrypt";
import path from "path";
import multer from "multer";

//? Importing Models ?//
import { signupModel } from "../db/database.js";
import { saveModel } from "../db/database.js";

//? Add these to your controller.js ?//
import crypto from "crypto";
import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

//? Multer configuration ?//
export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "../uploads/profile-images");
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    if (/jpe?g|png|gif/i.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

//? Signup Controller ?//
export const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //* Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    //* Check existing user
    if (await signupModel.exists({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    //* Create user with hashed password
    const user = await signupModel.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      profileImage: req.file
        ? `/uploads/profile-images/${req.file.filename}`
        : null,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    //* Cleanup uploaded file if error occurs
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: error.message });
  }
};

//? Login Controller ?//
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await signupModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Store complete user data in session
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    };

    // Explicitly save the session
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ error: "Session error" });
      }

      res.status(200).json({
        message: "User logged in successfully",
        user: {
          name: user.name,
          email: user.email,
          profileImage: user.profileImage
            ? `http://localhost:${process.env.PORT || 3001}${user.profileImage}`
            : null,
          _id: user?._id,
        },
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? Save Controller ?//
export const saveController = async (req, res) => {
  try {
    console.log("Incoming session:", req.session);
    console.log("Session ID:", req.sessionID);

    if (!req.session?.user) {
      console.error("No user in session - Full session:", req.session);
      return res.status(401).json({
        message: "Unauthorized - Session expired or invalid",
        sessionData: req.session,
      });
    }

    const { title, description, htmlCode, cssCode, jsCode } = req.body;
    console.log("Creating document for user:", req.session?.user?._id);

    const saveCode = new saveModel({
      title,
      description,
      htmlCode,
      cssCode,
      jsCode,
      userId: req.session?.user?._id,
    });

    await saveCode.save();
    res.status(200).json({
      message: "Code saved successfully",
      code: saveCode,
    });
  } catch (error) {
    console.error("Save error details:", error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

//? Getting Saved Projects ?//
export const getSavedController = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Only fetch projects for the currently logged-in user
    const savedCodes = await saveModel
      .find({ userId: req.session.user._id }) // Filter by the logged-in user's ID
      .sort({ date: -1 })
      .select("title description date _id");

    res.status(200).json(savedCodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? Get a specific saved code ?//
export const getSingleSavedController = async (req, res) => {
  try {
    const savedCode = await saveModel.findById(req.params.id);
    if (!savedCode) {
      return res.status(404).json({ message: "Code not found" });
    }

    // Verify the requesting user owns this project
    if (savedCode.userId.toString() !== req.session?.user?._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json({
      htmlCode: savedCode.htmlCode,
      cssCode: savedCode.cssCode,
      jsCode: savedCode.jsCode,
      title: savedCode.title,
      userId: savedCode.userId, // Include for frontend verification
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? Delete a saved code ?//
export const deleteSavedController = async (req, res) => {
  try {
    const deletedCode = await saveModel.findByIdAndDelete(req.params.id);
    if (!deletedCode) {
      return res.status(404).json({ message: "Code not found" });
    }
    res.status(200).json({ message: "Code deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//? Update a saved code ?//
export const updateSavedController = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const updatedCode = await saveModel.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );

    if (!updatedCode) {
      return res.status(404).json({ message: "Code not found" });
    }

    res.status(200).json({
      message: "Code updated successfully",
      code: updatedCode,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
