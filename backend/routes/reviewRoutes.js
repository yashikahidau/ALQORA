const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

const authMiddleware = require("../middleware/authMiddleware");

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

// =========================================
// ADD REVIEW
// =========================================

router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const { productId, rating, review } = req.body;

      if (!productId || !isValidObjectId(productId)) {
        return res.status(400).json({
          success: false,
          error: "Valid productId is required",
        });
      }

      const numericRating = Number(rating);
      const trimmedReview = review?.trim();

      if (!numericRating || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({
          success: false,
          error: "Rating must be between 1 and 5",
        });
      }

      if (!trimmedReview) {
        return res.status(400).json({
          success: false,
          error: "Review is required",
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      // Check if user has a delivered order containing this product
      const deliveredOrder = await Order.findOne({
        userId: req.user.userId,
        status: "Delivered",
        "products.productId": productId,
      });

      if (!deliveredOrder) {
        return res.status(400).json({
          success: false,
          error: "You can review only purchased products",
        });
      }

      // Prevent duplicate review
      const existingReview = await Review.findOne({
        productId,
        userId: req.user.userId,
      });

      if (existingReview) {
        return res.status(400).json({
          success: false,
          error: "You already reviewed this product",
        });
      }

      const newReview = await Review.create({
        productId,
        userId: req.user.userId,
        rating: numericRating,
        review: trimmedReview,
      });

      // Recalculate product review stats
      const reviewStats = await Review.aggregate([
        {
          $match: {
            productId: new mongoose.Types.ObjectId(productId),
          },
        },
        {
          $group: {
            _id: "$productId",
            totalReviews: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      const stats = reviewStats[0] || {
        totalReviews: 0,
        averageRating: 0,
      };

      await Product.findByIdAndUpdate(productId, {
        totalReviews: stats.totalReviews,
        averageRating: Number(stats.averageRating.toFixed(1)),
      });

      res.status(201).json({
        success: true,
        data: newReview,
      });
    } catch (error) {
      console.error("ADD REVIEW ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to add review",
      });
    }
  }
);

// =========================================
// GET PRODUCT REVIEWS
// =========================================

router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid product id",
      });
    }

    const reviews = await Review.find({
      productId,
    })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch reviews",
    });
  }
});

module.exports = router;