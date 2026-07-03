const express = require("express");

const router = express.Router();

const StoreSettings = require("../models/StoreSettings");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ======================================
// HELPERS
// ======================================

const buildSettingsResponse = (settings) => ({
  wishlistEnabled:
    settings.storeExperience?.wishlist ?? true,

  reviewsEnabled:
    settings.storeExperience?.reviews ?? true,

  trackingEnabled:
    settings.storeExperience?.tracking ?? true,

  guestCheckout:
    settings.storeExperience?.guestCheckout ?? false,

  codEnabled:
    settings.payments?.cod ?? false,
});

const sanitizeBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  return fallback;
};

const getOrCreateSettings = async () => {
  let settings = await StoreSettings.findOne();

  if (!settings) {
    settings = await StoreSettings.create({});
  }

  return settings;
};

// ======================================
// GET ADMIN SETTINGS
// GET /admin/settings
// ======================================

router.get(
  "/settings",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const settings =
        await getOrCreateSettings();

      res.json({
        success: true,
        settings:
          buildSettingsResponse(settings),
      });

    } catch (error) {
      console.error(
        "GET ADMIN SETTINGS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        error: "Failed to load settings",
      });
    }
  }
);

// ======================================
// UPDATE ADMIN SETTINGS
// PUT /admin/settings
// ======================================

router.put(
  "/settings",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const existingSettings =
        await getOrCreateSettings();

      const nextSettings = {
        wishlistEnabled:
          sanitizeBoolean(
            req.body.wishlistEnabled,
            existingSettings.storeExperience?.wishlist ?? true
          ),

        reviewsEnabled:
          sanitizeBoolean(
            req.body.reviewsEnabled,
            existingSettings.storeExperience?.reviews ?? true
          ),

        trackingEnabled:
          sanitizeBoolean(
            req.body.trackingEnabled,
            existingSettings.storeExperience?.tracking ?? true
          ),

        guestCheckout:
          sanitizeBoolean(
            req.body.guestCheckout,
            existingSettings.storeExperience?.guestCheckout ?? false
          ),

        codEnabled:
          sanitizeBoolean(
            req.body.codEnabled,
            existingSettings.payments?.cod ?? false
          ),
      };

      const settings =
        await StoreSettings.findOneAndUpdate(
          {},
          {
            $set: {
              "storeExperience.wishlist":
                nextSettings.wishlistEnabled,

              "storeExperience.reviews":
                nextSettings.reviewsEnabled,

              "storeExperience.tracking":
                nextSettings.trackingEnabled,

              "storeExperience.guestCheckout":
                nextSettings.guestCheckout,

              "payments.cod":
                nextSettings.codEnabled,
            },
          },
          {
            new: true,
            upsert: true,
          }
        );

      res.json({
        success: true,
        message:
          "Store settings updated successfully",
        settings:
          buildSettingsResponse(settings),
      });

    } catch (error) {
      console.error(
        "UPDATE ADMIN SETTINGS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        error: "Failed to save settings",
      });
    }
  }
);

// ======================================
// GET PUBLIC STORE SETTINGS
// GET /admin/settings/public
// ======================================

router.get(
  "/settings/public",
  async (req, res) => {
    try {
      const settings =
        await getOrCreateSettings();

      res.json({
        success: true,
        settings:
          buildSettingsResponse(settings),
      });

    } catch (error) {
      console.error(
        "GET PUBLIC STORE SETTINGS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        error: "Failed to load store settings",
      });
    }
  }
);

module.exports = router;