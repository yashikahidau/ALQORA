const mongoose = require("mongoose");

const storeSettingsSchema =
  new mongoose.Schema(
    {
      storeExperience: {
        wishlist: {
          type: Boolean,
          default: true,
        },

        reviews: {
          type: Boolean,
          default: true,
        },

        tracking: {
          type: Boolean,
          default: true,
        },

        guestCheckout: {
          type: Boolean,
          default: false,
        },

        freeShipping: {
          type: Boolean,
          default: true,
        },
      },

      payments: {
        razorpay: {
          type: Boolean,
          default: true,
        },

        upi: {
          type: Boolean,
          default: true,
        },

        cards: {
          type: Boolean,
          default: true,
        },

        cod: {
          type: Boolean,
          default: false,
        },
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "StoreSettings",
    storeSettingsSchema
  );