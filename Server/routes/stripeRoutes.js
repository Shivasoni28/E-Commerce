const express = require("express");
const { handleStripeWebhook } = require("../controllers/stripeController");

const router = express.Router();

// Stripe requires raw body, so we handle it here
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

module.exports = router;
