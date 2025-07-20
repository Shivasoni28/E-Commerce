const Cart = require("../models/cartModel");

const getCart = async (req, res) => {
  try {
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product", "name price image");
res.status(200).json(cart || { items: [] });

  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch cart", error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { id, name, price, quantity, image } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === id
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: id,
        name,
        price,
        quantity: Number(quantity),
        image,
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error("Add to cart error:", error);
    res
      .status(500)
      .json({ message: "Failed to add item to cart", error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to remove item from cart",
        error: error.message,
      });
  }
};

module.exports = { getCart, addToCart, removeFromCart };
