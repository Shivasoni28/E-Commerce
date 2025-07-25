const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});



const createStripeCheckout = async (req,res)=>{
   try {
        console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const line_items = cart.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.product.name },
        unit_amount: item.product.price * 100, // in paise
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/orders?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/cart?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: "Failed to create Stripe session", error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user.id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalAmount,
      shippingAddress: req.body.shippingAddress || "Not provided",
      paymentMethod: req.body.paymentMethod || "cod",
    });

    
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,  
  createStripeCheckout
};