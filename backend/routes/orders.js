const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");
const StoreSettings = require("../models/StoreSettings");

const sendEmail = require("../utils/sendEmail");
const sendOrderStatusEmail = require("../utils/sendOrderStatusEmail");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ======================================
// UPDATE USER BADGE AFTER DELIVERED ORDERS
// ======================================
const updateUserBadge = async (userId) => {
  const deliveredOrders = await Order.find({
    userId,
    status: "Delivered",
  });

  const totalSpent = deliveredOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  let badge = "Member";

  if (totalSpent >= 100000) badge = "Elite";
  else if (totalSpent >= 50000) badge = "Platinum";
  else if (totalSpent >= 25000) badge = "Gold";
  else if (totalSpent >= 10000) badge = "Silver";

  await User.findByIdAndUpdate(userId, { badge });
};

// ======================================
// ORDER CONFIRMATION EMAIL HTML
// ======================================
const buildOrderConfirmationEmail = ({
  userName,
  order,
  paymentMethod,
  paymentStatus,
  razorpayPaymentId,
}) => {
  return `
<div style="background:#F8F1EB;padding:50px 20px;font-family:Arial,sans-serif;color:#2D211D;">
  <div style="max-width:700px;margin:auto;background:#ffffff;border-radius:32px;overflow:hidden;border:1px solid #E7D8CF;box-shadow:0 20px 60px rgba(0,0,0,0.08);">
    <div style="background:#7A2E3A;padding:60px 40px;text-align:center;color:white;">
      <h1 style="margin:0;font-size:48px;letter-spacing:4px;font-weight:700;">ALQORA</h1>
      <p style="margin-top:12px;opacity:.9;letter-spacing:1px;">UNVEIL THE AURA</p>
    </div>

    <div style="padding:50px">
      <div style="text-align:center;margin-bottom:40px;">
        <span style="background:#DCFCE7;color:#166534;padding:10px 18px;border-radius:999px;font-size:12px;font-weight:bold;letter-spacing:1px;">
          ✓ ORDER CONFIRMED
        </span>
      </div>

      <h2 style="text-align:center;font-size:34px;margin-top:0;color:#2D211D;">
        Thank You For Your Purchase ✨
      </h2>

      <p style="text-align:center;font-size:16px;color:#6B5B55;line-height:1.8;">
        Hi ${userName},
        <br/><br/>
        Your ALQORA order has been successfully placed and is now being prepared by our team.
      </p>

      <div style="background:#FAF6F3;border:1px solid #E7D8CF;border-radius:24px;padding:30px;margin-top:40px;">
        <table width="100%">
          <tr>
            <td>
              <span style="color:#8E7468;">Order Total</span>
              <h2 style="margin:8px 0;">₹${Number(order.totalAmount).toFixed(2)}</h2>
            </td>
            <td align="right">
              <span style="color:#8E7468;">Payment</span>
              <p style="margin-top:8px;font-weight:600;text-transform:uppercase;">
                ${paymentMethod}
              </p>
            </td>
          </tr>
        </table>
      </div>

      <div style="margin-top:25px;text-align:center;">
        <span
          style="
            background:${paymentStatus === "Paid" ? "#DCFCE7" : "#FEF3C7"};
            color:${paymentStatus === "Paid" ? "#166534" : "#92400E"};
            padding:12px 20px;
            border-radius:999px;
            font-weight:bold;
          "
        >
          Payment Status: ${paymentStatus}
        </span>
      </div>

      ${
        razorpayPaymentId
          ? `
      <div style="margin-top:25px;background:#F8F1EB;border-radius:18px;padding:20px;text-align:center;">
        <div style="color:#8E7468;margin-bottom:10px;">Transaction ID</div>
        <strong>${razorpayPaymentId}</strong>
      </div>
      `
          : ""
      }

      <div style="margin-top:50px;">
        <h3 style="margin-bottom:20px;">Shipping Details</h3>
        <div style="background:#FAF6F3;border:1px solid #E7D8CF;border-radius:24px;padding:24px;line-height:1.8;">
          <strong>${order.shippingAddress.fullName}</strong><br/>
          ${order.shippingAddress.phone}<br/>
          ${order.shippingAddress.address}
        </div>
      </div>

      <div style="margin-top:50px;">
        <h3>Products Ordered</h3>
        ${order.products
          .map(
            (product) => `
          <div style="display:flex;align-items:center;gap:20px;padding:20px 0;border-bottom:1px solid #EFE4DC;">
            <img
              src="${product.image_link}"
              width="90"
              height="90"
              style="display:block;width:90px;height:90px;border-radius:18px;object-fit:cover;border:1px solid #E7D8CF;flex-shrink:0;"
            />
            <div style="flex:1;">
              <h4 style="margin:0 0 10px;">${product.name}</h4>
              <div style="color:#8E7468;">Quantity: ${product.quantity}</div>
              <div style="margin-top:6px;font-weight:bold;color:#7A2E3A;">
                ₹${Number(product.price).toFixed(2)}
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>

      <div style="margin-top:60px;padding-top:30px;border-top:1px solid #E7D8CF;text-align:center;">
        <h3 style="margin-bottom:10px;">ALQORA</h3>
        <p style="color:#8E7468;line-height:1.8;">
          Thank you for choosing ALQORA.
          <br/>
          We will notify you once your order has been shipped.
        </p>
        <p style="margin-top:25px;color:#A17F72;font-size:13px;">
          © 2026 ALQORA • Unveil The Aura
        </p>
      </div>
    </div>
  </div>
</div>
`;
};

// ======================================
// CREATE ORDER
// ======================================
router.post("/", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  const start = Date.now();

  try {
    const {
      products,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      razorpayPaymentId,
      razorpayOrderId,
    } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No products provided",
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName?.trim() ||
      !shippingAddress.phone?.trim() ||
      !shippingAddress.address?.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: "Complete shipping details are required",
      });
    }

    const productIds = products.map((item) => item.productId);

    const dbProducts = await Product.find({
      _id: { $in: productIds },
    });

    if (dbProducts.length !== products.length) {
      return res.status(400).json({
        success: false,
        error: "Some products are invalid or unavailable",
      });
    }

    const productMap = new Map(
      dbProducts.map((product) => [String(product._id), product])
    );

    let finalProducts = [];
    let totalAmount = 0;

    for (const item of products) {
      const dbProduct = productMap.get(String(item.productId));

      if (!dbProduct) {
        return res.status(400).json({
          success: false,
          error: "Invalid product in order",
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          error: `Invalid quantity for ${dbProduct.name}`,
        });
      }

      if ((dbProduct.stock ?? 0) < quantity) {
        return res.status(400).json({
          success: false,
          error: `${dbProduct.name} is out of stock or has insufficient stock`,
        });
      }

      finalProducts.push({
        productId: dbProduct._id,
        name: dbProduct.name,
        image_link: dbProduct.image_link,
        price: Number(dbProduct.price),
        quantity,
      });

      totalAmount += Number(dbProduct.price) * quantity;
    }

    let codEnabled = true;

    try {
      const settings = await StoreSettings.findOne();
      if (settings && typeof settings.codEnabled === "boolean") {
        codEnabled = settings.codEnabled;
      }
    } catch (settingsError) {
      console.error("STORE SETTINGS FETCH ERROR:", settingsError);
    }

    if (paymentMethod === "cod" && !codEnabled) {
      return res.status(400).json({
        success: false,
        error: "Cash on Delivery is currently unavailable",
      });
    }

    const normalizedPaymentMethod =
      paymentMethod === "razorpay" ? "razorpay" : "cod";

    const normalizedPaymentStatus =
      normalizedPaymentMethod === "razorpay" && paymentStatus === "Paid"
        ? "Paid"
        : "Pending";

    let createdOrder = null;

    await session.withTransaction(async () => {
      for (const item of finalProducts) {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: item.productId,
            stock: { $gte: item.quantity },
          },
          {
            $inc: { stock: -item.quantity },
          },
          {
            new: true,
            session,
          }
        );

        if (!updatedProduct) {
          throw new Error(`${item.name} went out of stock during checkout`);
        }
      }

      createdOrder = await Order.create(
        [
          {
            userId: req.user.userId,
            products: finalProducts,
            totalAmount,
            status: "Pending",
            shippingAddress: {
              fullName: shippingAddress.fullName.trim(),
              phone: shippingAddress.phone.trim(),
              address: shippingAddress.address.trim(),
            },
            paymentMethod: normalizedPaymentMethod,
            paymentStatus: normalizedPaymentStatus,
            razorpayPaymentId: razorpayPaymentId || undefined,
            razorpayOrderId: razorpayOrderId || undefined,
          },
        ],
        { session }
      );

      createdOrder = createdOrder[0];

      await Cart.findOneAndUpdate(
        { userId: req.user.userId },
        { $set: { items: [] } },
        { session }
      );
    });

    const user = await User.findById(req.user.userId);

    if (user?.email && createdOrder) {
      try {
        const html = buildOrderConfirmationEmail({
          userName: user.name || "Customer",
          order: createdOrder,
          paymentMethod: normalizedPaymentMethod === "cod" ? "Cash On Delivery" : "Razorpay",
          paymentStatus: createdOrder.paymentStatus,
          razorpayPaymentId: createdOrder.razorpayPaymentId,
        });

        await sendEmail(
          user.email,
          "ALQORA • Order Confirmation",
          html
        );
      } catch (mailError) {
        console.error("ORDER CONFIRMATION EMAIL FAILED:", mailError);
      }
    }

    return res.status(201).json({
      success: true,
      data: createdOrder,
      message: "Order placed successfully",
      debugTimeMs: Date.now() - start,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to create order",
    });
  } finally {
    await session.endSession();
  }
});

// ======================================
// GET MY ORDERS (USER)
// ======================================
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch your orders",
    });
  }
});

// ======================================
// GET ALL ORDERS (ADMIN)
// ======================================
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });
  }
});

// ======================================
// UPDATE ORDER STATUS (ADMIN)
// ======================================
router.patch("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required",
      });
    }

    const existingOrder = await Order.findById(req.params.id);

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    const allowedTransitions = {
      Pending: ["Processing", "Cancelled"],
      Processing: ["Packed", "Cancelled"],
      Packed: ["Shipped", "Cancelled"],
      Shipped: ["Out For Delivery"],
      "Out For Delivery": ["Delivered"],
      Delivered: [],
      Cancelled: [],
    };

    if (!allowedTransitions[existingOrder.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Cannot change order from ${existingOrder.status} to ${status}`,
      });
    }

    const updateData = { status };

    if (status === "Delivered" && existingOrder.paymentMethod === "cod") {
      updateData.paymentStatus = "Paid";
    }

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("userId", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    try {
      await sendOrderStatusEmail(
        order.userId.email,
        order.userId.name,
        order,
        status
      );
    } catch (mailError) {
      console.error("ORDER STATUS EMAIL FAILED:", mailError);
    }

    if (status === "Delivered") {
      await updateUserBadge(order.userId._id);
    }

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("ORDER STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to update order",
    });
  }
});

// ======================================
// CANCEL ORDER (USER)
// ======================================
router.put("/cancel/:orderId", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    let finalOrder = null;

    await session.withTransaction(async () => {
      const order = await Order.findOne({
        _id: req.params.orderId,
        userId: req.user.userId,
      }).session(session);

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.status !== "Pending" && order.status !== "Processing") {
        throw new Error("This order can no longer be cancelled");
      }

      for (const item of order.products) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } },
          { session }
        );
      }

      order.status = "Cancelled";

      if (order.paymentMethod === "cod") {
        order.paymentStatus = "Failed";
      }

      await order.save({ session });
      finalOrder = order;
    });

    const user = await User.findById(req.user.userId);

    if (user?.email && finalOrder) {
      try {
        await sendOrderStatusEmail(
          user.email,
          user.name,
          finalOrder,
          "Cancelled"
        );
      } catch (mailError) {
        console.error("CANCEL ORDER EMAIL FAILED:", mailError);
      }
    }

    return res.json({
      success: true,
      message: "Order cancelled successfully",
      data: finalOrder,
    });
  } catch (error) {
    console.error("CANCEL ORDER ERROR:", error);

    const statusCode =
      error.message === "Order not found"
        ? 404
        : error.message === "This order can no longer be cancelled"
        ? 400
        : 500;

    return res.status(statusCode).json({
      success: false,
      error: statusCode === 500 ? "Failed to cancel order" : error.message,
    });
  } finally {
    await session.endSession();
  }
});

module.exports = router;