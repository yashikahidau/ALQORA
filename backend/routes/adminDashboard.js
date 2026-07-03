const express = require("express");

const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ======================================
// GET ADMIN DASHBOARD STATS
// ======================================

router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const [
        totalOrders,
        totalProducts,
        totalCustomers,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        paidOrders,
        failedOrders,
        revenueResult,
        recentOrders,
        topCustomersAgg,
      ] = await Promise.all([
        Order.countDocuments(),
        Product.countDocuments(),
        User.countDocuments({ role: "user" }),
        Order.countDocuments({ status: "Pending" }),
        Order.countDocuments({ status: "Processing" }),
        Order.countDocuments({ status: "Shipped" }),
        Order.countDocuments({ status: "Delivered" }),
        Order.countDocuments({ status: "Cancelled" }),
        Order.countDocuments({ paymentStatus: "Paid" }),
        Order.countDocuments({ paymentStatus: "Failed" }),

        Order.aggregate([
          {
            $match: {
              status: "Delivered",
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: "$totalAmount",
              },
            },
          },
        ]),

        Order.find()
          .populate("userId", "name email")
          .sort({ createdAt: -1 })
          .limit(5),

        Order.aggregate([
          {
            $match: {
              userId: { $ne: null },
            },
          },
          {
            $group: {
              _id: "$userId",
              totalSpent: {
                $sum: "$totalAmount",
              },
              totalOrders: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              totalSpent: -1,
            },
          },
          {
            $limit: 5,
          },
        ]),
      ]);

      const totalRevenue =
        revenueResult.length > 0
          ? revenueResult[0].totalRevenue
          : 0;

      // Fetch user details for top customers
      const topCustomerIds = topCustomersAgg.map(
        (customer) => customer._id
      );

      const topCustomerUsers = await User.find({
        _id: { $in: topCustomerIds },
      }).select("name email badge");

      const userMap = new Map(
        topCustomerUsers.map((user) => [
          user._id.toString(),
          user,
        ])
      );

      const topCustomers = topCustomersAgg.map((customer) => {
        const user = userMap.get(customer._id.toString());

        return {
          name: user?.name || "Unknown",
          email: user?.email || "",
          badge: user?.badge || "Member",
          totalSpent: customer.totalSpent,
          totalOrders: customer.totalOrders,
        };
      });

      res.json({
        success: true,
        stats: {
          totalRevenue,
          totalOrders,
          totalProducts,
          totalCustomers,
          pendingOrders,
          processingOrders,
          shippedOrders,
          deliveredOrders,
          cancelledOrders,
          paidOrders,
          failedOrders,
        },
        recentOrders,
        topCustomers,
      });
    } catch (error) {
      console.error("ADMIN DASHBOARD ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to load dashboard stats",
      });
    }
  }
);

module.exports = router;