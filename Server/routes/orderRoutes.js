const express = require("express");
const router = express.Router();
const {createOrder , getUserOrders, createStripeCheckout} = require( "../controllers/orderController.js");
const protect = require("../middlewares/authMiddleware.js");

router.post("/",protect, createOrder);
router.get("/", protect, getUserOrders);
router.post("/checkout", protect, createStripeCheckout);

module.exports = router;