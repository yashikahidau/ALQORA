const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const User = require("../models/User");
const Order = require("../models/Order");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const VALID_ROLES = ["user", "admin"];
const VALID_BADGES = [
  "Member",
  "Silver",
  "Gold",
  "Platinum",
  "Elite",
];

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

// ======================================
// GET ALL USERS
// ======================================

router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find({ role: "user" })
        .sort({ createdAt: -1 })
        .select("name email role badge createdAt");

      const userIds = users.map((user) => user._id);

      const orderStats = await Order.aggregate([
        {
          $match: {
            userId: { $in: userIds },
          },
        },
        {
          $group: {
            _id: "$userId",
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: "$totalAmount" },
          },
        },
      ]);

      const statsMap = new Map(
        orderStats.map((item) => [
          item._id.toString(),
          {
            totalOrders: item.totalOrders,
            totalSpent: item.totalSpent,
          },
        ])
      );

      const usersWithStats = users.map((user) => {
        const stats = statsMap.get(user._id.toString());

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          badge: user.badge,
          createdAt: user.createdAt,
          totalOrders: stats?.totalOrders || 0,
          totalSpent: stats?.totalSpent || 0,
        };
      });

      res.json({
        success: true,
        users: usersWithStats,
      });
    } catch (error) {
      console.error("GET USERS ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to load users",
      });
    }
  }
);

// ======================================
// EXPORT USERS
// ======================================

router.get(
  "/users/export",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find({ role: "user" })
        .sort({ createdAt: -1 })
        .select("name email role badge createdAt");

      const userIds = users.map((user) => user._id);

      const orderStats = await Order.aggregate([
        {
          $match: {
            userId: { $in: userIds },
          },
        },
        {
          $group: {
            _id: "$userId",
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: "$totalAmount" },
          },
        },
      ]);

      const statsMap = new Map(
        orderStats.map((item) => [
          item._id.toString(),
          {
            totalOrders: item.totalOrders,
            totalSpent: item.totalSpent,
          },
        ])
      );

      const rows = users.map((user) => {
        const stats = statsMap.get(user._id.toString());

        return {
          Name: user.name,
          Email: user.email,
          Badge: user.badge,
          Role: user.role,
          Orders: stats?.totalOrders || 0,
          TotalSpent: stats?.totalSpent || 0,
          Joined: new Date(user.createdAt).toLocaleDateString("en-GB"),
        };
      });

      res.json({
        success: true,
        customers: rows,
      });
    } catch (error) {
      console.error("EXPORT USERS ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to export customers",
      });
    }
  }
);

// ======================================
// EXPORT ORDERS
// ======================================

router.get(
  "/orders/export",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

      const rows = orders.map((order) => ({
        OrderID: order._id,
        Customer: order.userId?.name || "Deleted User",
        Email: order.userId?.email || "-",
        Amount: order.totalAmount,
        Status: order.status,
        PaymentStatus: order.paymentStatus,
        PaymentMethod: order.paymentMethod || "-",
        Date: new Date(order.createdAt).toLocaleDateString("en-GB"),
      }));

      res.json({
        success: true,
        orders: rows,
      });
    } catch (error) {
      console.error("EXPORT ORDERS ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to export orders",
      });
    }
  }
);

// ======================================
// EXPORT REVENUE
// ======================================

router.get(
  "/revenue/export",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const revenue = await Order.aggregate([
        {
          $match: {
            status: "Delivered",
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            totalRevenue: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 },
            averageOrderValue: { $avg: "$totalAmount" },
          },
        },
        {
          $sort: {
            "_id.year": -1,
            "_id.month": -1,
          },
        },
      ]);

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const rows = revenue.map((item) => ({
        Month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
        DeliveredOrders: item.totalOrders,
        Revenue: item.totalRevenue,
        AverageOrderValue: Math.round(item.averageOrderValue || 0),
      }));

      res.json({
        success: true,
        revenue: rows,
      });
    } catch (error) {
      console.error("EXPORT REVENUE ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to export revenue",
      });
    }
  }
);

// ======================================
// UPDATE USER ROLE
// ======================================

router.patch(
  "/users/:id/role",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          error: "Invalid user id",
        });
      }

      if (!VALID_ROLES.includes(role)) {
        return res.status(400).json({
          success: false,
          error: "Invalid role",
        });
      }

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      // Prevent admin from removing their own admin access
      if (
        user._id.toString() === req.user.userId &&
        role !== "admin"
      ) {
        return res.status(400).json({
          success: false,
          error: "You cannot remove your own admin access",
        });
      }

      user.role = role;
      await user.save();

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("UPDATE ROLE ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to update role",
      });
    }
  }
);

// ======================================
// UPDATE USER BADGE
// ======================================

router.patch(
  "/users/:id/badge",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { badge } = req.body;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          error: "Invalid user id",
        });
      }

      if (!VALID_BADGES.includes(badge)) {
        return res.status(400).json({
          success: false,
          error: "Invalid badge",
        });
      }

      const user = await User.findByIdAndUpdate(
        id,
        { badge },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("UPDATE BADGE ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to update badge",
      });
    }
  }
);

// ======================================
// GET SINGLE USER + THEIR ORDERS
// ======================================

router.get(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          error: "Invalid user id",
        });
      }

      const user = await User.findById(id).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const orders = await Order.find({ userId: id }).sort({
        createdAt: -1,
      });

      res.json({
        success: true,
        user,
        orders,
      });
    } catch (error) {
      console.error("GET USER DETAILS ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to load user details",
      });
    }
  }
);

// ======================================
// DELETE USER
// ======================================

router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          error: "Invalid user id",
        });
      }

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      if (user.role === "admin") {
        return res.status(400).json({
          success: false,
          error: "Admin accounts cannot be deleted",
        });
      }

      if (user._id.toString() === req.user.userId) {
        return res.status(400).json({
          success: false,
          error: "You cannot delete your own account from admin panel",
        });
      }

      await User.findByIdAndDelete(id);

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("DELETE USER ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to delete user",
      });
    }
  }
);

module.exports = router;