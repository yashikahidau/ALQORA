const express = require("express");

const router = express.Router();

const Cart = require("../models/Cart");
const Product = require("../models/Product");

const authMiddleware =
  require("../middleware/authMiddleware");

// ======================================
// GET USER CART
// GET /cart
// ======================================

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const cart =
        await Cart.findOne({
          userId: req.user.userId,
        }).populate("items.productId");

      res.json({
        success: true,
        data: cart || {
          userId: req.user.userId,
          items: [],
        },
      });

    } catch (error) {
      console.error("GET CART ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to fetch cart",
      });
    }
  }
);

// ======================================
// ADD ITEM TO CART
// POST /cart
// ======================================

router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        productId,
        quantity = 1,
      } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          error: "Product ID is required",
        });
      }

      const parsedQuantity =
        Number(quantity);

      if (
        !Number.isInteger(parsedQuantity) ||
        parsedQuantity < 1
      ) {
        return res.status(400).json({
          success: false,
          error: "Quantity must be at least 1",
        });
      }

      const product =
        await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      if (product.stock <= 0) {
        return res.status(400).json({
          success: false,
          error: "Product is out of stock",
        });
      }

      if (parsedQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          error: `Only ${product.stock} item(s) available`,
        });
      }

      let cart =
        await Cart.findOne({
          userId: req.user.userId,
        });

      if (!cart) {
        cart = await Cart.create({
          userId: req.user.userId,
          items: [
            {
              productId,
              quantity: parsedQuantity,
            },
          ],
        });
      } else {
        const existingItem =
          cart.items.find(
            (item) =>
              item.productId.toString() === productId
          );

        if (existingItem) {
          const newQuantity =
            existingItem.quantity +
            parsedQuantity;

          if (newQuantity > product.stock) {
            return res.status(400).json({
              success: false,
              error: `Only ${product.stock} item(s) available`,
            });
          }

          existingItem.quantity =
            newQuantity;
        } else {
          cart.items.push({
            productId,
            quantity: parsedQuantity,
          });
        }

        await cart.save();
      }

      const updatedCart =
        await Cart.findById(cart._id)
          .populate("items.productId");

      res.status(201).json({
        success: true,
        message: "Item added to cart",
        data: updatedCart,
      });

    } catch (error) {
      console.error("ADD TO CART ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to add item to cart",
      });
    }
  }
);

// ======================================
// UPDATE CART ITEM QUANTITY
// PUT /cart/:productId
// ======================================

router.put(
  "/:productId",
  authMiddleware,
  async (req, res) => {
    try {
      const { quantity } = req.body;
      const { productId } = req.params;

      const parsedQuantity =
        Number(quantity);

      if (
        !Number.isInteger(parsedQuantity) ||
        parsedQuantity < 1
      ) {
        return res.status(400).json({
          success: false,
          error: "Quantity must be at least 1",
        });
      }

      const product =
        await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      if (parsedQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          error: `Only ${product.stock} item(s) available`,
        });
      }

      const cart =
        await Cart.findOne({
          userId: req.user.userId,
        });

      if (!cart) {
        return res.status(404).json({
          success: false,
          error: "Cart not found",
        });
      }

      const item =
        cart.items.find(
          (item) =>
            item.productId.toString() === productId
        );

      if (!item) {
        return res.status(404).json({
          success: false,
          error: "Item not found in cart",
        });
      }

      item.quantity =
        parsedQuantity;

      await cart.save();

      const updatedCart =
        await Cart.findById(cart._id)
          .populate("items.productId");

      res.json({
        success: true,
        message: "Cart quantity updated",
        data: updatedCart,
      });

    } catch (error) {
      console.error("UPDATE CART ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to update cart quantity",
      });
    }
  }
);

// ======================================
// REMOVE SINGLE ITEM FROM CART
// DELETE /cart/:productId
// ======================================

router.delete(
  "/:productId",
  authMiddleware,
  async (req, res) => {
    try {
      const { productId } = req.params;

      const cart =
        await Cart.findOne({
          userId: req.user.userId,
        });

      if (!cart) {
        return res.status(404).json({
          success: false,
          error: "Cart not found",
        });
      }

      const itemExists =
        cart.items.some(
          (item) =>
            item.productId.toString() === productId
        );

      if (!itemExists) {
        return res.status(404).json({
          success: false,
          error: "Item not found in cart",
        });
      }

      cart.items =
        cart.items.filter(
          (item) =>
            item.productId.toString() !== productId
        );

      await cart.save();

      const updatedCart =
        await Cart.findById(cart._id)
          .populate("items.productId");

      res.json({
        success: true,
        message: "Item removed from cart",
        data: updatedCart,
      });

    } catch (error) {
      console.error("REMOVE CART ITEM ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to remove item from cart",
      });
    }
  }
);

// ======================================
// CLEAR ENTIRE CART
// DELETE /cart
// ======================================

router.delete(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const cart =
        await Cart.findOne({
          userId: req.user.userId,
        });

      if (!cart) {
        return res.status(404).json({
          success: false,
          error: "Cart not found",
        });
      }

      cart.items = [];
      await cart.save();

      res.json({
        success: true,
        message: "Cart cleared successfully",
        data: cart,
      });

    } catch (error) {
      console.error("CLEAR CART ERROR:", error);

      res.status(500).json({
        success: false,
        error: "Failed to clear cart",
      });
    }
  }
);

module.exports = router;