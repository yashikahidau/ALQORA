const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");

const router = express.Router();

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// ======================================
// GOOGLE LOGIN
// ======================================

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Google token is required",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({
        success: false,
        error: "Invalid Google token payload",
      });
    }

    const { sub, email, name, email_verified } = payload;

    if (!sub || !email || !name) {
      return res.status(400).json({
        success: false,
        error: "Incomplete Google account data",
      });
    }

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        error: "Google email is not verified",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        googleId: sub,
      });
    } else if (!user.googleId) {
      // If an account already exists with same email via normal signup,
      // link Google ID to that account
      user.googleId = sub;
      await user.save();
    }

    const jwtToken = jwt.sign(
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

    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        badge: user.badge,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      error: "Google login failed",
    });
  }
});

module.exports = router;