const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================
// HELPERS
// ======================================

const createToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const buildUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    badge:
      user.role === "admin"
        ? "Administrator"
        : user.badge,
    createdAt: user.createdAt,
    googleId: user.googleId || null,
  };
};

// ======================================
// REGISTER USER
// POST /auth/register
// ======================================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        error: "Name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = createToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: buildUserResponse(user),
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      error: "Registration failed",
    });
  }
});

// ======================================
// LOGIN USER
// POST /auth/login
// ======================================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        error:
          "This account was created using Google login. Please continue with Google.",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const token = createToken(user);

    res.json({
      success: true,
      token,
      user: buildUserResponse(user),
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
});

// ======================================
// GET LOGGED IN USER
// GET /auth/me
// ======================================

router.get(
  "/me",
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.userId
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      res.json({
        success: true,
        user: buildUserResponse(user),
      });

    } catch (error) {
      console.error("GET PROFILE ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to load profile",
      });
    }
  }
);

// ======================================
// UPDATE LOGGED IN USER PROFILE
// PUT /auth/me
// ======================================

router.put(
  "/me",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        email,
      } = req.body;

      if (
        !name?.trim() ||
        !email?.trim()
      ) {
        return res.status(400).json({
          success: false,
          error: "Name and email are required",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      const existingUser =
        await User.findOne({
          email: normalizedEmail,
          _id: {
            $ne: req.user.userId,
          },
        });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Email already exists",
        });
      }

      const updatedUser =
        await User.findByIdAndUpdate(
          req.user.userId,
          {
            name: name.trim(),
            email: normalizedEmail,
          },
          {
            new: true,
            runValidators: true,
          }
        ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
        user: buildUserResponse(updatedUser),
      });

    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to update profile",
      });
    }
  }
);

// ======================================
// CHANGE PASSWORD
// PUT /auth/change-password
// ======================================

router.put(
  "/change-password",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      if (
        !currentPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          success: false,
          error: "All password fields are required",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          error:
            "New password must be at least 8 characters long",
        });
      }

      const user =
        await User.findById(
          req.user.userId
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      if (!user.password) {
        return res.status(400).json({
          success: false,
          error:
            "Password cannot be changed for a Google-only account",
        });
      }

      const isMatch =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          error: "Current password is incorrect",
        });
      }

      const isSamePassword =
        await bcrypt.compare(
          newPassword,
          user.password
        );

      if (isSamePassword) {
        return res.status(400).json({
          success: false,
          error:
            "New password must be different from the current password",
        });
      }

      user.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      await user.save();

      res.json({
        success: true,
        message: "Password updated successfully",
      });

    } catch (error) {
      console.error("CHANGE PASSWORD ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to update password",
      });
    }
  }
);

module.exports = router;