const Stripe = require("stripe");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Webhook handler for Stripe
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const shippingAddress = session.metadata.shippingAddress || "Not provided";

    try {
      const cart = await Cart.findOne({ user: userId }).populate("items.product");
      if (!cart) {
        console.error(`Cart not found for user ${userId}`);
        return res.status(404).json({ message: "Cart not found" });
      }

      const totalAmount = cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      // Create order
      await Order.create({
        user: userId,
        items: cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        totalAmount,
        shippingAddress,
        paymentMethod: "stripe",
      });

      // Clear the cart
      cart.items = [];
      await cart.save();

      console.log(`✅ Order created for user ${userId}`);
    } catch (err) {
      console.error("❌ Error handling Stripe webhook:", err.message);
    }
  }

  res.json({ received: true });
};

module.exports = { handleStripeWebhook };
