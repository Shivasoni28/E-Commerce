"use client";
import { useEffect, useState } from "react";
import { useCart } from "../context/cartContext";
import axiosInstance from "../utils/axiosInstance";
import Link from "next/link";

export default function CartPage() {
  const {
    cart,
    fetchCart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    clearCart,
    placeOrder,
  } = useCart();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod");

  const handlePlaceOrder = async () => {
    if (!address.trim()) return alert("Please enter a shipping address");

    if (paymentMethod === "cod") {
      try {
        const order = await placeOrder(address, "cod");
        alert("Order placed successfully (COD)!");
        await fetchCart();
      } catch (error) {
        console.error(error);
        alert("Failed to place order");
      }
    } else {
      // Stripe Checkout Flow
      try {
        const { data } = await axiosInstance.post(
          "/orders/checkout",
          {},
          { withCredentials: true }
        );
        window.location.href = data.url; // Redirect to Stripe Checkout
      } catch (error) {
        console.error(error);
        alert("Failed to start Stripe payment");
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (!cart || cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <div className="flex items-center justify-center gap-4">
        <Link href="/" className="text-blue-600 underline hover:text-blue-800">
          Go Back to Shop
        </Link>
        <Link href="/orders" className="text-blue-600 underline hover:text-blue-800">View Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {/* Cart Items */}
      <div className="flex flex-col gap-4">
        {cart.map((item, index) => {
          if (!item.product) return null;
          const key = item._id || `${item.product._id}-${index}`;

          return (
            <div key={key} className="flex items-center gap-4 border-b pb-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.product.name}</h2>
                <p className="text-gray-600">₹{item.product.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.product._id, "decrement")}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, "increment")}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="font-bold">₹{item.product.price * item.quantity}</p>
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="ml-4 text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      {/* Shipping Address */}
      <div className="mt-6">
        <label className="block text-lg font-semibold mb-2">Shipping Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your shipping address"
          className="w-full p-3 border rounded focus:outline-none focus:ring"
          rows={3}
        />
      </div>

      {/* Payment Selection */}
      <div className="mt-4">
        <label className="block text-lg font-semibold mb-2">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as "cod" | "stripe")}
          className="w-full p-3 border rounded focus:outline-none"
        >
          <option value="cod">Cash on Delivery</option>
          <option value="stripe">Pay with Card (Stripe)</option>
        </select>
      </div>

      {/* Total & Actions */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">
          Total: <span className="text-blue-600">₹{totalPrice}</span>
        </h2>
        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Clear Cart
          </button>
          <button
            onClick={handlePlaceOrder}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

