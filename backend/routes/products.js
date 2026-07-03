const express = require("express");

const router = express.Router();

const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ======================================
// HELPERS
// ======================================

function normalizeProductType(type) {
  if (!type || typeof type !== "string") {
    return "";
  }

  return type
    .trim()
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
}

function normalizePrice(price) {
  const parsedPrice = Number(price);

  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    return null;
  }

  return parsedPrice.toFixed(2);
}

function normalizeStock(stock) {
  const parsedStock = Number(stock);

  if (!Number.isInteger(parsedStock) || parsedStock < 0) {
    return null;
  }

  return parsedStock;
}

// ======================================
// GET ALL PRODUCTS
// GET /products
// ======================================

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: products,
    });

  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
    });
  }
});

// ======================================
// GET PRODUCT BY ID
// GET /products/:id
// ======================================

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch product",
    });
  }
});

// ======================================
// CREATE PRODUCT
// POST /products
// ADMIN ONLY
// ======================================

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        price,
        description,
        image_link,
        product_type,
        stock,
      } = req.body;

      if (
        !name?.trim() ||
        !description?.trim() ||
        !image_link?.trim() ||
        !product_type?.trim()
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Name, price, description, image and product type are required",
        });
      }

      const normalizedPrice =
        normalizePrice(price);

      if (normalizedPrice === null) {
        return res.status(400).json({
          success: false,
          error: "Price must be a valid positive number",
        });
      }

      const normalizedStock =
        normalizeStock(stock);

      if (normalizedStock === null) {
        return res.status(400).json({
          success: false,
          error: "Stock must be 0 or more",
        });
      }

      const product = await Product.create({
        name: name.trim(),
        price: normalizedPrice,
        description: description.trim(),
        image_link: image_link.trim(),
        product_type:
          normalizeProductType(product_type),
        stock: normalizedStock,
      });

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });

    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to create product",
      });
    }
  }
);

// ======================================
// UPDATE PRODUCT
// PUT /products/:id
// ADMIN ONLY
// ======================================

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        price,
        description,
        image_link,
        product_type,
        stock,
      } = req.body;

      const product = await Product.findById(
        req.params.id
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      if (
        !name?.trim() ||
        !description?.trim() ||
        !image_link?.trim() ||
        !product_type?.trim()
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Name, price, description, image and product type are required",
        });
      }

      const normalizedPrice =
        normalizePrice(price);

      if (normalizedPrice === null) {
        return res.status(400).json({
          success: false,
          error: "Price must be a valid positive number",
        });
      }

      const normalizedStock =
        normalizeStock(stock);

      if (normalizedStock === null) {
        return res.status(400).json({
          success: false,
          error: "Stock must be 0 or more",
        });
      }

      product.name = name.trim();
      product.price = normalizedPrice;
      product.description =
        description.trim();
      product.image_link =
        image_link.trim();
      product.product_type =
        normalizeProductType(product_type);
      product.stock = normalizedStock;

      await product.save();

      res.json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });

    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to update product",
      });
    }
  }
);

// ======================================
// DELETE PRODUCT
// DELETE /products/:id
// ADMIN ONLY
// ======================================

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const product =
        await Product.findByIdAndDelete(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      res.json({
        success: true,
        message: "Product deleted successfully",
      });

    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to delete product",
      });
    }
  }
);

module.exports = router;