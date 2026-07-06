require("dotenv").config();

const express = require("express");

const connectDB = require("./config/db");

const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://alqora-frontend.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

const productsRoutes = require("./routes/products");

const authRoutes = require("./routes/auth");

const cartRoutes = require("./routes/cart");

const googleAuthRoutes =
     require("./routes/googleAuth");

const path = require("path");

const uploadRoutes =
     require("./routes/upload");

const orderRoutes = require("./routes/orders");

const adminMiddleware =
     require(
          "./middleware/adminMiddleware"
     );
const authMiddleware = require("./middleware/authMiddleware");

const paymentRoutes =
     require("./routes/payment");

const invoiceRoutes =
     require("./routes/invoice");

const adminDashboardRoutes =
     require("./routes/adminDashboard");

const reviewRoutes =
     require("./routes/reviewRoutes");

const adminUsersRoutes =
     require("./routes/adminUsers");

const adminSettingsRoutes =
     require("./routes/adminSettings");

app.get(
     "/admin",
     authMiddleware,
     adminMiddleware,
     (req, res) => {

          res.json({
               success: true,
               message:
                    "Welcome Admin",
          });
     }
);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(
     "/uploads",
     express.static(
          path.join(__dirname, "uploads")
     )
);


app.use("/products", productsRoutes);

app.use("/auth", authRoutes);

app.use("/cart", cartRoutes);

app.use(
     "/upload",
     uploadRoutes
);

app.use(
     "/auth",
     googleAuthRoutes
)

app.use(
     "/orders",
     orderRoutes
);

app.use(
     "/payment",
     paymentRoutes
);

app.use(
     "/invoice",
     invoiceRoutes
);

app.use(
     "/admin-dashboard",
     adminDashboardRoutes
);

app.use(
     "/reviews",
     reviewRoutes
)

app.use(
     "/admin",
     adminUsersRoutes
);

app.use(
     "/admin",
     adminSettingsRoutes
);


app.get("/", (req, res) => {

     res.json({
          success: true,
          message: "ALQORA Backend Routing",
     });
});


app.get("/db-ping", async (req, res) => {
  const start = Date.now();

  try {
    const Order = require("./models/Order");

    const count = await Order.countDocuments();

    return res.json({
      success: true,
      count,
      timeMs: Date.now() - start,
    });
  } catch (error) {
    console.error("DB PING ERROR:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timeMs: Date.now() - start,
    });
  }
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});


app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  if (err.message === "Only image files are allowed") {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      error: "File too large",
    });
  }

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      error: "CORS blocked this request",
    });
  }

  return res.status(500).json({
    success: false,
    error: "Server error",
  });
});

connectDB();



app.listen(PORT, () => {

     console.log(
          `Server running on port ${PORT}`
     );
});