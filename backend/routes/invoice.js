const express = require("express");
const PDFDocument = require("pdfkit");

const router = express.Router();

const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

// ======================================
// GET INVOICE PDF
// GET /invoice/:orderId
// ======================================

router.get(
  "/:orderId",
  authMiddleware,
  async (req, res) => {
    try {
      const { orderId } = req.params;

      const order = await Order.findById(orderId).populate(
        "userId",
        "name email"
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          error: "Order not found",
        });
      }

      if (
        !order.userId ||
        order.userId._id.toString() !== req.user.userId
      ) {
        return res.status(403).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const invoiceNumber = `ALQ-${new Date(
        order.createdAt
      ).getFullYear()}-${order._id
        .toString()
        .slice(-6)
        .toUpperCase()}`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${invoiceNumber}.pdf"`
      );

      const doc = new PDFDocument({
        size: "A4",
        margin: 45,
      });

      doc.pipe(res);

      // ======================================
      // DESIGN TOKENS
      // ======================================

      const PRIMARY = "#7A2E3A";
      const ACCENT = "#A17F72";
      const TEXT = "#2D211D";
      const MUTED = "#6E5E58";
      const LIGHT_BG = "#FAF7F5";
      const BORDER = "#EBE3DE";
      const SUCCESS = "#2E7D32";
      const DANGER = "#C62828";

      const totalAmount = Number(order.totalAmount || 0);
      const subtotal = totalAmount / 1.18;
      const gst = totalAmount - subtotal;

      const customerName =
        order.shippingAddress?.fullName ||
        order.userId?.name ||
        "Customer";

      const customerEmail =
        order.userId?.email || "N/A";

      const customerPhone =
        order.shippingAddress?.phone || "N/A";

      const customerAddress =
        order.shippingAddress?.address ||
        "No address provided";

      const paymentMethodLabel =
        order.paymentMethod === "razorpay"
          ? "Razorpay"
          : order.paymentMethod === "cod"
          ? "Cash on Delivery"
          : "N/A";

      const paymentStatus =
        (order.paymentStatus || "Pending").toUpperCase();

      // ======================================
      // HELPERS
      // ======================================

      const formatMoney = (value) => {
        return `₹${Number(value || 0).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      };

      const drawDivider = (y, x1 = 45, x2 = 550, color = BORDER, width = 0.8) => {
        doc
          .moveTo(x1, y)
          .lineTo(x2, y)
          .strokeColor(color)
          .lineWidth(width)
          .stroke();
      };

      const renderMetaRow = (label, value, y, x = 320) => {
        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor(TEXT)
          .text(label, x, y, { width: 70 });

        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(MUTED)
          .text(value, x + 75, y, { width: 150 });
      };

      const renderSummaryRow = (
        label,
        value,
        y,
        isBold = false
      ) => {
        doc
          .font(isBold ? "Helvetica-Bold" : "Helvetica")
          .fontSize(isBold ? 11 : 9.5)
          .fillColor(isBold ? PRIMARY : TEXT)
          .text(label, 330, y, {
            width: 130,
            align: "left",
          });

        doc
          .font(isBold ? "Helvetica-Bold" : "Helvetica")
          .fontSize(isBold ? 11 : 9.5)
          .fillColor(isBold ? PRIMARY : TEXT)
          .text(value, 460, y, {
            width: 85,
            align: "right",
          });
      };

      // ======================================
      // HEADER
      // ======================================

      doc
        .fillColor(PRIMARY)
        .font("Helvetica-Bold")
        .fontSize(28)
        .text("ALQORA", 45, 45, {
          characterSpacing: 2,
        });

      doc
        .fillColor(ACCENT)
        .font("Helvetica")
        .fontSize(8.5)
        .text("UNVEIL THE AURA", 47, 76, {
          characterSpacing: 4,
        });

      doc
        .fillColor(MUTED)
        .font("Helvetica")
        .fontSize(8.5)
        .text(
          "ALQORA Luxury Atelier Private Limited",
          320,
          48,
          { align: "right", width: 230 }
        )
        .text(
          "101, Epicentre Corporate Heights, Indore, MP",
          320,
          60,
          { align: "right", width: 230 }
        )
        .text(
          "concierge@alqora.com  |  GSTIN: 23AAXCA1234A1Z5",
          320,
          72,
          { align: "right", width: 230 }
        );

      drawDivider(100);

      doc
        .fillColor(PRIMARY)
        .font("Helvetica-Bold")
        .fontSize(16)
        .text("RETAIL TAX INVOICE", 45, 115, {
          characterSpacing: 1,
        });

      // ======================================
      // BILL TO + INVOICE DETAILS
      // ======================================

      const blockY = 155;
      const leftColWidth = 230;
      const rightColX = 320;

      doc
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .fillColor(ACCENT)
        .text("BILL TO", 45, blockY)
        .text("INVOICE DETAILS", rightColX, blockY);

      drawDivider(blockY + 14, 45, 45 + leftColWidth, BORDER, 0.75);
      drawDivider(blockY + 14, rightColX, rightColX + leftColWidth, BORDER, 0.75);

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(customerName, 45, blockY + 24, {
          width: leftColWidth,
        });

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(MUTED)
        .text(`Email: ${customerEmail}`, 45, blockY + 42)
        .text(`Phone: ${customerPhone}`, 45, blockY + 56)
        .text(`Address: ${customerAddress}`, 45, blockY + 70, {
          width: leftColWidth,
          lineGap: 1,
        });

      renderMetaRow("Invoice No:", invoiceNumber, blockY + 24, rightColX);
      renderMetaRow(
        "Order Ref:",
        order._id.toString().slice(-10).toUpperCase(),
        blockY + 38,
        rightColX
      );
      renderMetaRow(
        "Date Issued:",
        new Date(order.createdAt).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        blockY + 52,
        rightColX
      );
      renderMetaRow(
        "Payment:",
        paymentMethodLabel,
        blockY + 66,
        rightColX
      );

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(TEXT)
        .text("Txn Status:", rightColX, blockY + 80);

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(paymentStatus === "PAID" ? SUCCESS : DANGER)
        .text(paymentStatus, rightColX + 75, blockY + 80);

      // ======================================
      // PRODUCT TABLE
      // ======================================

      const tableTopY = 275;

      doc
        .rect(45, tableTopY, 505, 22)
        .fill(LIGHT_BG);

      doc
        .fillColor(PRIMARY)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text("PRODUCT", 55, tableTopY + 7)
        .text("QTY", 340, tableTopY + 7, {
          width: 35,
          align: "center",
        })
        .text("UNIT PRICE", 395, tableTopY + 7, {
          width: 65,
          align: "right",
        })
        .text("TOTAL", 470, tableTopY + 7, {
          width: 75,
          align: "right",
        });

      let currentY = tableTopY + 22;

      const products = Array.isArray(order.products)
        ? order.products
        : [];

      products.forEach((item, index) => {
        const price = Number(item.price || 0);
        const qty = Number(item.quantity || 1);
        const lineTotal = price * qty;

        if (index % 2 === 1) {
          doc
            .rect(45, currentY, 505, 26)
            .fill("#FDFBF9");
        }

        doc
          .fillColor(TEXT)
          .font("Helvetica")
          .fontSize(9)
          .text(item.name || "Product", 55, currentY + 9, {
            width: 260,
            ellipsis: true,
          })
          .text(String(qty), 340, currentY + 9, {
            width: 35,
            align: "center",
          })
          .text(formatMoney(price), 395, currentY + 9, {
            width: 65,
            align: "right",
          })
          .text(formatMoney(lineTotal), 470, currentY + 9, {
            width: 75,
            align: "right",
          });

        drawDivider(currentY + 26, 45, 550, BORDER, 0.5);
        currentY += 26;
      });

      // ======================================
      // TOTALS
      // ======================================

      currentY += 18;

      renderSummaryRow(
        "Taxable Subtotal:",
        formatMoney(subtotal),
        currentY
      );
      currentY += 18;

      renderSummaryRow(
        "Integrated GST (18%):",
        formatMoney(gst),
        currentY
      );
      currentY += 18;

      renderSummaryRow(
        "Shipping:",
        "FREE",
        currentY
      );
      currentY += 18;

      drawDivider(currentY + 2, 330, 545, PRIMARY, 1);
      currentY += 10;

      renderSummaryRow(
        "TOTAL DUE (INR):",
        formatMoney(totalAmount),
        currentY,
        true
      );

      // ======================================
      // NOTES
      // ======================================

      currentY += 28;

      doc
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .fillColor(PRIMARY)
        .text("Notes", 45, currentY);

      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(MUTED)
        .text(
          "Thank you for choosing ALQORA. This invoice serves as proof of your completed transaction. Please retain it for future reference.",
          45,
          currentY + 14,
          {
            width: 260,
            lineGap: 1.5,
          }
        );

      // ======================================
      // FOOTER
      // ======================================

      drawDivider(765);

      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor(MUTED)
        .text(
          "This is a system-generated electronic invoice and does not require a physical signature.",
          45,
          776,
          {
            width: 505,
            align: "center",
          }
        );

      doc.end();

    } catch (error) {
      console.error("INVOICE PDF ERROR:", error);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: "Failed to generate invoice",
        });
      }
    }
  }
);

module.exports = router;