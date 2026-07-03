const express = require("express");

const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");
const StoreSettings = require("../models/StoreSettings");

const sendEmail = require("../utils/sendEmail");
const sendOrderStatusEmail = require("../utils/sendOrderStatusEmail");

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");


// ======================================
// UPDATE USER BADGE AFTER DELIVERED ORDERS
// ======================================

const updateUserBadge = async (userId) => {

  const deliveredOrders =
    await Order.find({
      userId,
      status: "Delivered",
    });

  const totalSpent =
    deliveredOrders.reduce(
      (sum, order) =>
        sum + Number(order.totalAmount || 0),
      0
    );

  let badge = "Member";

  if (totalSpent >= 100000) {
    badge = "Elite";
  } else if (totalSpent >= 50000) {
    badge = "Platinum";
  } else if (totalSpent >= 25000) {
    badge = "Gold";
  } else if (totalSpent >= 10000) {
    badge = "Silver";
  }

  await User.findByIdAndUpdate(
    userId,
    { badge }
  );
};


// ======================================
// CREATE ORDER
// ======================================

router.post(
  "/",
  authMiddleware,

  async (req, res) => {
    try {

      const {
        products,
        shippingAddress,
        paymentMethod,
        paymentStatus,
        razorpayPaymentId,
        razorpayOrderId,
      } = req.body;

      // ------------------------------
      // BASIC VALIDATIONS
      // ------------------------------

      if (
        !Array.isArray(products) ||
        products.length === 0
      ) {
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

      if (
        !paymentMethod ||
        !["cod", "razorpay"].includes(paymentMethod)
      ) {
        return res.status(400).json({
          success: false,
          error: "Invalid payment method",
        });
      }

      // ------------------------------
      // STORE SETTINGS CHECK
      // ------------------------------

      const settings =
        await StoreSettings.findOne();

      if (
        paymentMethod === "cod" &&
        settings &&
        settings.payments &&
        settings.payments.cod === false
      ) {
        return res.status(400).json({
          success: false,
          error: "Cash on Delivery is currently unavailable.",
        });
      }

      // ------------------------------
      // REBUILD PRODUCTS FROM DATABASE
      // DO NOT TRUST FRONTEND PRICE / TOTAL
      // ------------------------------

      const orderProducts = [];
      let calculatedTotal = 0;

      for (const item of products) {

        if (
          !item.productId ||
          !Number.isInteger(Number(item.quantity)) ||
          Number(item.quantity) < 1
        ) {
          return res.status(400).json({
            success: false,
            error: "Invalid product data in order",
          });
        }

        const product =
          await Product.findById(item.productId);

        if (!product) {
          return res.status(404).json({
            success: false,
            error: "One of the selected products no longer exists",
          });
        }

        const requestedQty =
          Number(item.quantity);

        if (product.stock <= 0) {
          return res.status(400).json({
            success: false,
            error: `${product.name} is out of stock`,
          });
        }

        if (requestedQty > product.stock) {
          return res.status(400).json({
            success: false,
            error: `Only ${product.stock} ${product.name} available`,
          });
        }

        const productPrice =
          Number(product.price);

        if (Number.isNaN(productPrice)) {
          return res.status(500).json({
            success: false,
            error: `Invalid price configured for ${product.name}`,
          });
        }

        orderProducts.push({
          productId: product._id,
          name: product.name,
          image_link: product.image_link,
          price: productPrice,
          quantity: requestedQty,
        });

        calculatedTotal +=
          productPrice * requestedQty;
      }

      // ------------------------------
      // DETERMINE SAFE PAYMENT STATUS
      // ------------------------------

      let safePaymentStatus = "Pending";

      if (paymentMethod === "razorpay") {
        safePaymentStatus =
          paymentStatus === "Paid"
            ? "Paid"
            : "Pending";
      }

      if (paymentMethod === "cod") {
        safePaymentStatus = "Pending";
      }

      // ------------------------------
      // CREATE ORDER
      // ------------------------------

      const order =
        await Order.create({
          userId: req.user.userId,
          products: orderProducts,
          totalAmount: calculatedTotal,
          shippingAddress: {
            fullName:
              shippingAddress.fullName.trim(),
            phone:
              shippingAddress.phone.trim(),
            address:
              shippingAddress.address.trim(),
          },
          paymentMethod,
          paymentStatus: safePaymentStatus,
          razorpayPaymentId:
            razorpayPaymentId || undefined,
          razorpayOrderId:
            razorpayOrderId || undefined,
        });

      // ------------------------------
      // REDUCE STOCK
      // ------------------------------

      for (const item of orderProducts) {
        await Product.findByIdAndUpdate(
          item.productId,
          {
            $inc: {
              stock: -item.quantity,
            },
          }
        );
      }

      // ------------------------------
      // CLEAR USER CART
      // ------------------------------

      await Cart.findOneAndUpdate(
        { userId: req.user.userId },
        { $set: { items: [] } }
      );

      // ------------------------------
      // SEND ORDER CONFIRMATION EMAIL
      // ------------------------------

      const user =
        await User.findById(req.user.userId);

      if (user?.email) {
        await sendEmail(
          user.email,
          "ALQORA • Order Confirmation",
          `
<div
  style="
    background:#F8F1EB;
    padding:50px 20px;
    font-family:Arial,sans-serif;
    color:#2D211D;
  "
>
  <div
    style="
      max-width:700px;
      margin:auto;
      background:#ffffff;
      border-radius:32px;
      overflow:hidden;
      border:1px solid #E7D8CF;
      box-shadow:0 20px 60px rgba(0,0,0,0.08);
    "
  >

    <div
      style="
        background:#7A2E3A;
        padding:60px 40px;
        text-align:center;
        color:white;
      "
    >
      <h1
        style="
          margin:0;
          font-size:48px;
          letter-spacing:4px;
          font-weight:700;
        "
      >
        ALQORA
      </h1>

      <p
        style="
          margin-top:12px;
          opacity:.9;
          letter-spacing:1px;
        "
      >
        UNVEIL THE AURA
      </p>
    </div>

    <div style="padding:50px">

      <div
        style="
          text-align:center;
          margin-bottom:40px;
        "
      >
        <span
          style="
            background:#DCFCE7;
            color:#166534;
            padding:10px 18px;
            border-radius:999px;
            font-size:12px;
            font-weight:bold;
            letter-spacing:1px;
          "
        >
          ✓ ORDER CONFIRMED
        </span>
      </div>

      <h2
        style="
          text-align:center;
          font-size:34px;
          margin-top:0;
          color:#2D211D;
        "
      >
        Thank You For Your Purchase ✨
      </h2>

      <p
        style="
          text-align:center;
          font-size:16px;
          color:#6B5B55;
          line-height:1.8;
        "
      >
        Hi ${user.name},
        <br/><br/>
        Your ALQORA order has been successfully placed
        and is now being prepared by our team.
      </p>

      <div
        style="
          background:#FAF6F3;
          border:1px solid #E7D8CF;
          border-radius:24px;
          padding:30px;
          margin-top:40px;
        "
      >
        <table width="100%">
          <tr>
            <td>
              <span style="color:#8E7468;">
                Order Total
              </span>

              <h2 style="margin:8px 0;">
                ₹${Number(calculatedTotal).toFixed(2)}
              </h2>
            </td>

            <td align="right">
              <span style="color:#8E7468;">
                Payment
              </span>

              <p
                style="
                  margin-top:8px;
                  font-weight:600;
                  text-transform:uppercase;
                "
              >
                ${paymentMethod}
              </p>
            </td>
          </tr>
        </table>
      </div>

      <div
        style="
          margin-top:25px;
          text-align:center;
        "
      >
        <span
          style="
            background:
            ${safePaymentStatus === "Paid"
              ? "#DCFCE7"
              : "#FEF3C7"};

            color:
            ${safePaymentStatus === "Paid"
              ? "#166534"
              : "#92400E"};

            padding:12px 20px;
            border-radius:999px;
            font-weight:bold;
          "
        >
          Payment Status:
          ${safePaymentStatus}
        </span>
      </div>

      ${razorpayPaymentId
        ? `
      <div
        style="
          margin-top:25px;
          background:#F8F1EB;
          border-radius:18px;
          padding:20px;
          text-align:center;
        "
      >
        <div
          style="
            color:#8E7468;
            margin-bottom:10px;
          "
        >
          Transaction ID
        </div>

        <strong>
          ${razorpayPaymentId}
        </strong>
      </div>
      `
        : ""}

      <div style="margin-top:50px;">
        <h3 style="margin-bottom:20px;">
          Shipping Details
        </h3>

        <div
          style="
            background:#FAF6F3;
            border:1px solid #E7D8CF;
            border-radius:24px;
            padding:24px;
            line-height:1.8;
          "
        >
          <strong>
            ${shippingAddress.fullName}
          </strong>
          <br/>
          ${shippingAddress.phone}
          <br/>
          ${shippingAddress.address}
        </div>
      </div>

      <div style="margin-top:50px;">
        <h3>Products Ordered</h3>

        ${orderProducts.map(product => `
          <div
            style="
              display:flex;
              align-items:center;
              gap:20px;
              padding:20px 0;
              border-bottom:1px solid #EFE4DC;
            "
          >
            <img
              src="${product.image_link}"
              width="90"
              height="90"
              style="
                display:block;
                width:90px;
                height:90px;
                border-radius:18px;
                object-fit:cover;
                border:1px solid #E7D8CF;
                flex-shrink:0;
              "
            />

            <div style="flex:1;">
              <h4 style="margin:0 0 10px;">
                ${product.name}
              </h4>

              <div style="color:#8E7468;">
                Quantity: ${product.quantity}
              </div>

              <div
                style="
                  margin-top:6px;
                  font-weight:bold;
                  color:#7A2E3A;
                "
              >
                ₹${Number(product.price).toFixed(2)}
              </div>
            </div>
          </div>
        `).join("")}
      </div>

      <div
        style="
          margin-top:60px;
          padding-top:30px;
          border-top:1px solid #E7D8CF;
          text-align:center;
        "
      >
        <h3 style="margin-bottom:10px;">
          ALQORA
        </h3>

        <p
          style="
            color:#8E7468;
            line-height:1.8;
          "
        >
          Thank you for choosing ALQORA.
          <br/>
          We will notify you once your order
          has been shipped.
        </p>

        <p
          style="
            margin-top:25px;
            color:#A17F72;
            font-size:13px;
          "
        >
          © 2026 ALQORA • Unveil The Aura
        </p>
      </div>

    </div>
  </div>
</div>
`
        );
      }

      return res.status(201).json({
        success: true,
        data: order,
      });

    } catch (error) {
      console.error("CREATE ORDER ERROR:", error);

      return res.status(500).json({
        success: false,
        error: "Failed to create order",
      });
    }
  }
);


// ======================================
// GET MY ORDERS
// ======================================

router.get(
  "/my-orders",
  authMiddleware,

  async (req, res) => {
    try {

      const orders =
        await Order.find({
          userId: req.user.userId,
        })
          .populate("products.productId")
          .sort({
            createdAt: -1,
          });

      return res.json({
        success: true,
        data: orders,
      });

    } catch (error) {
      console.error("GET MY ORDERS ERROR:", error);

      return res.status(500).json({
        success: false,
        error: "Failed to fetch orders",
      });
    }
  }
);


// ======================================
// GET ALL ORDERS (ADMIN)
// ======================================

router.get(
  "/",
  authMiddleware,
  adminMiddleware,

  async (req, res) => {
    try {

      const orders =
        await Order.find()
          .populate("userId", "name email")
          .sort({
            createdAt: -1,
          });

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
  }
);


// ======================================
// UPDATE ORDER STATUS (ADMIN)
// ======================================

router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,

  async (req, res) => {
    try {

      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: "Status is required",
        });
      }

      const existingOrder =
        await Order.findById(req.params.id);

      if (!existingOrder) {
        return res.status(404).json({
          success: false,
          error: "Order not found",
        });
      }

      const allowedTransitions = {
        Pending: [
          "Processing",
          "Cancelled",
        ],
        Processing: [
          "Packed",
          "Cancelled",
        ],
        Packed: [
          "Shipped",
          "Cancelled",
        ],
        Shipped: [
          "Out For Delivery",
        ],
        "Out For Delivery": [
          "Delivered",
        ],
        Delivered: [],
        Cancelled: [],
      };

      if (
        !allowedTransitions[
          existingOrder.status
        ]?.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          error:
            `Cannot change order from ${existingOrder.status} to ${status}`,
        });
      }

      const updateData = {
        status,
      };

      if (
        status === "Delivered" &&
        existingOrder.paymentMethod === "cod"
      ) {
        updateData.paymentStatus = "Paid";
      }

      const order =
        await Order.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            returnDocument: "after",
          }
        ).populate(
          "userId",
          "name email"
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          error: "Order not found",
        });
      }

      await sendOrderStatusEmail(
        order.userId.email,
        order.userId.name,
        order,
        status
      );

      if (status === "Delivered") {
        await updateUserBadge(
          order.userId._id
        );
      }

      return res.json({
        success: true,
        data: order,
      });

    } catch (error) {
      console.error(
        "ORDER STATUS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        error: "Failed to update order",
      });
    }
  }
);


// ======================================
// CANCEL ORDER (USER)
// ======================================

router.put(
  "/cancel/:orderId",
  authMiddleware,

  async (req, res) => {
    try {

      const order =
        await Order.findOne({
          _id: req.params.orderId,
          userId: req.user.userId,
        });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: "Order not found",
        });
      }

      if (
        order.status !== "Pending" &&
        order.status !== "Processing"
      ) {
        return res.status(400).json({
          success: false,
          error:
            "This order can no longer be cancelled",
        });
      }

      // Restore stock
      for (const item of order.products) {
        await Product.findByIdAndUpdate(
          item.productId,
          {
            $inc: {
              stock: item.quantity,
            },
          }
        );
      }

      order.status = "Cancelled";

      if (order.paymentMethod === "cod") {
        order.paymentStatus = "Failed";
      }

      await order.save();

      const user =
        await User.findById(order.userId);

      if (user?.email) {
        await sendOrderStatusEmail(
          user.email,
          user.name,
          order,
          "Cancelled"
        );
      }

      return res.json({
        success: true,
        message: "Order cancelled successfully",
      });

    } catch (error) {
      console.error("CANCEL ORDER ERROR:", error);

      return res.status(500).json({
        success: false,
        error: "Failed to cancel order",
      });
    }
  }
);

module.exports = router;