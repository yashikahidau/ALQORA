const sendEmail = require("./sendEmail");

const sendOrderStatusEmail = async (
  userEmail,
  userName,
  order,
  newStatus
) => {
  let subject = "";
  let message = "";

  if (newStatus === "Processing") {
    subject = "ALQORA • Your Order Is Being Prepared ✨";
    message = "Our team has started preparing your order.";
  } else if (newStatus === "Packed") {
    subject = "ALQORA • Your Order Has Been Packed ✨";
    message = "Your order has been carefully packed and is ready for shipment.";
  } else if (newStatus === "Shipped") {
    subject = "ALQORA • Your Order Is On Its Way 📦";
    message = "Your order has been shipped and is on its way to you.";
  } else if (newStatus === "Out For Delivery") {
    subject = "ALQORA • Out For Delivery 🚚";
    message = "Your order is out for delivery and should arrive soon.";
  } else if (newStatus === "Delivered") {
    subject = "ALQORA • Your Order Has Been Delivered ✨";
    message =
      "Your order has been successfully delivered. You can securely download your invoice anytime from your ALQORA account.";
  } else if (newStatus === "Cancelled") {
    subject = "ALQORA • Your Order Has Been Cancelled";
    message =
      "Your order has been cancelled. If this was unexpected, please contact our support team.";
  } else {
    return;
  }

  const statusBadgeMap = {
    Processing: "✨ ORDER PROCESSING",
    Packed: "📦 ORDER PACKED",
    Shipped: "🚚 ORDER SHIPPED",
    "Out For Delivery": "🛵 OUT FOR DELIVERY",
    Delivered: "✅ ORDER DELIVERED",
    Cancelled: "❎ ORDER CANCELLED",
  };

  const statusColorMap = {
    Processing: "#B8860B",
    Packed: "#9333EA",
    Shipped: "#2563EB",
    "Out For Delivery": "#EA580C",
    Delivered: "#16A34A",
    Cancelled: "#DC2626",
  };

  const mainHeadingMap = {
    Processing: "Your Order Is Being Prepared ✨",
    Packed: "Your Order Has Been Packed ✨",
    Shipped: "Your Order Is On Its Way 📦",
    "Out For Delivery": "Your Order Is Out For Delivery 🚚",
    Delivered: "Your Order Has Been Delivered ✨",
    Cancelled: "Your Order Has Been Cancelled",
  };

  const statusBadge = statusBadgeMap[newStatus];
  const statusColor = statusColorMap[newStatus];
  const mainHeading = mainHeadingMap[newStatus];
  const products = Array.isArray(order?.products) ? order.products : [];

  const html = `
<div style="background:#F8F1EB;padding:20px 12px;font-family:Arial, sans-serif;">
  <div style="max-width:480px;margin:0 auto;background:#0D0D0D;border-radius:30px;overflow:hidden;">
    <div style="background:#7A2E3A;padding:40px 20px;text-align:center;color:white;">
      <h1 style="margin:0;font-size:32px;letter-spacing:5px;font-weight:normal;">ALQORA</h1>
      <p style="margin:8px 0 0 0;letter-spacing:3px;font-size:10px;color:#E2C4C9;">UNVEIL THE AURA</p>
    </div>

    <div style="padding:35px 20px;color:white;">
      <div style="text-align:center; margin-bottom: 20px;">
        <span style="background:${statusColor};padding:8px 18px;border-radius:999px;font-size:11px;font-weight:bold;letter-spacing:1px;display:inline-block;">
          ${statusBadge}
        </span>
      </div>

      <h2 style="text-align:center;font-size:24px;margin:0 0 12px 0;line-height:1.3;font-weight:bold;">
        ${mainHeading}
      </h2>

      <p style="text-align:center;color:#D1D5DB;line-height:1.5;font-size:14px;margin:0 0 20px 0;">
        Hi ${userName || "Customer"},
        <br/><br/>
        ${message}
      </p>

      <div style="text-align:center;color:#BCAAA4;font-size:11px;letter-spacing:2px;margin-bottom:25px;text-transform:uppercase;">
        ORDER #${order?._id?.toString()?.slice(-8)?.toUpperCase() || "ALQORA"}
      </div>

      <div style="background:#181818;border:1px solid #2B2B2B;border-radius:20px;padding:20px;margin-bottom:35px;">
        <div style="margin-bottom: 15px;">
          <div style="color:#AFAFAF;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">
            ORDER TOTAL
          </div>
          <div style="font-size:20px;font-weight:bold;line-height:1.1;color:white;">
            ₹${Number(order?.totalAmount || 0).toLocaleString("en-IN")}
          </div>
        </div>

        <div style="border-top: 1px solid #2B2B2B; margin-bottom: 15px;"></div>

        <div>
          <div style="color:#AFAFAF;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">
            CURRENT STATUS
          </div>
          <div style="font-size:18px;font-weight:bold;line-height:1.1;color:${statusColor};">
            ${newStatus}
          </div>
        </div>
      </div>

      <div style="margin-bottom:35px;">
        <h3 style="margin:0 0 12px 0;font-size:15px;font-weight:600;letter-spacing:0.5px;color:#E5E7EB;">
          Products Ordered
        </h3>

        ${
          products.length
            ? products
                .map(
                  (product) => `
          <div style="padding:12px 0;border-bottom:1px solid #242424;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
              <tr>
                <td width="72" valign="middle" style="width:72px;">
                  <img
                    src="${product.image_link || "https://via.placeholder.com/80"}"
                    width="64"
                    height="64"
                    style="display:block;width:64px;height:64px;border-radius:10px;object-fit:cover;border:1px solid #333;"
                  />
                </td>

                <td valign="middle" align="left" style="padding-left:12px; padding-right:12px;">
                  <h4 style="margin:0 0 2px 0;font-size:14px;font-weight:600;line-height:1.3;color:white;">
                    ${product.name}
                  </h4>
                  <p style="margin:0;font-size:12px;color:#9CA3AF;">
                    Quantity: ${product.quantity}
                  </p>
                </td>

                <td width="70" align="right" valign="middle" style="width:70px; white-space:nowrap;">
                  <h4 style="margin:0;color:#E6D2C8;font-size:14px;font-weight:600;">
                    ₹${product.price}
                  </h4>
                </td>
              </tr>
            </table>
          </div>
        `
                )
                .join("")
            : `<p style="color:#9CA3AF;font-size:13px;">No product details available.</p>`
        }
      </div>

      <div style="margin-bottom:35px;">
        <h3 style="margin:0 0 12px 0; font-size:15px; font-weight:600; letter-spacing:0.5px; color:#E5E7EB;">
          Shipping Details
        </h3>
        <div style="background:#181818;border:1px solid #2B2B2B;border-radius:20px;padding:18px;line-height:1.6;color:#D4D4D4;font-size:13px;">
          <strong style="color:white; display:inline-block; margin-bottom:4px;">
            ${order?.shippingAddress?.fullName || "Customer"}
          </strong>
          <br/>
          <span style="color:#A3A3A3;">${order?.shippingAddress?.phone || "-"}</span>
          <br/>
          <span style="color:#D4D4D4;">${order?.shippingAddress?.address || "-"}</span>
        </div>
      </div>

      <div style="text-align:center;margin-top:30px;margin-bottom:15px;">
        <a
          href="${process.env.FRONTEND_URL}/account/orders"
          style="display:inline-block;background:${newStatus === "Delivered" ? "#16A34A" : "#7A2E3A"};color:white;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:bold;letter-spacing:1px;font-size:12px;"
        >
          ${newStatus === "Delivered" ? "VIEW MY ORDERS" : "VIEW MY ORDER"}
        </a>
      </div>

      <div style="margin-top:40px;padding-top:25px;border-top:1px solid #2B2B2B;text-align:center;">
        <h3 style="margin:0 0 8px 0; font-size:15px; font-weight:normal; letter-spacing:2px;">
          ALQORA
        </h3>
        <p style="color:#9CA3AF;line-height:1.5;font-size:12px;margin:0;">
          Thank you for choosing ALQORA.
          <br/>
          Every product is carefully curated to elevate your beauty ritual.
          <br/>
          Unveil The Aura.
        </p>
        <p style="margin-top:20px;margin-bottom:0;font-size:10px;color: #525252;">
          © 2026 ALQORA • All Rights Reserved
        </p>
      </div>
    </div>
  </div>
</div>
`;

  const emailResult = await sendEmail(userEmail, subject, html);

  if (!emailResult.success) {
    console.error("ORDER STATUS EMAIL FAILED:", emailResult.error);
  }
};

module.exports = sendOrderStatusEmail;