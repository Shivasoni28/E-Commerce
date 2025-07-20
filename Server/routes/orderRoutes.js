const express = require("express");
const router = express.Router();
const {createOrder , getUserOrders} = require( "../controllers/orderController.js");
const protect = require("../middlewares/authMiddleware.js");

router.post("/",protect, createOrder);
router.get("/", protect, getUserOrders);

module.exports = router;