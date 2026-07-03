const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const razorpay = require("../config/razorpay");
const authMiddleware = require("../middleware/authMiddleware");

// ======================================
// CREATE RAZORPAY ORDER
// POST /payment/create-order
// ======================================

router.post(
  "/create-order",
  authMiddleware,
  async (req, res) => {
    try {
      const { amount } = req.body;

      const parsedAmount = Number(amount);

      if (!parsedAmount || parsedAmount <= 0) {
        return res.status(400).json({
          success: false,
          error: "Valid amount is required",
        });
      }

      const options = {
        amount: Math.round(parsedAmount * 100), // INR -> paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);

      res.json({
        success: true,
        order,
      });

    } catch (error) {
      console.error("RAZORPAY CREATE ORDER ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to create Razorpay order",
      });
    }
  }
);

// ======================================
// VERIFY RAZORPAY PAYMENT SIGNATURE
// POST /payment/verify
// ======================================

router.post(
  "/verify",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {
        return res.status(400).json({
          success: false,
          error: "Missing payment verification fields",
        });
      }

      const body =
        `${razorpay_order_id}|${razorpay_payment_id}`;

      const expectedSignature = crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(body.toString())
        .digest("hex");

      const isValid =
        expectedSignature === razorpay_signature;

      if (!isValid) {
        return res.status(400).json({
          success: false,
          error: "Invalid payment signature",
        });
      }

      res.json({
        success: true,
        message: "Payment verified successfully",
      });

    } catch (error) {
      console.error("RAZORPAY VERIFY ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to verify payment",
      });
    }
  }
);

module.exports = router;