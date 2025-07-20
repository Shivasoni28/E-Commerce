"use client";
import { useEffect } from "react";
import { useCart } from "../context/cartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, fetchCart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  if (!cart || cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Link href="/" className="text-blue-600 underline hover:text-blue-800">
          Go Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {/* Cart Items */}
      <div className="flex flex-col gap-4">
        {cart.map((item,index) => {
           if (!item.product) return null;
         const key = item._id || `${item.product._id}-${index}`;
          

          return (
            <div
              key={key}
              className="flex items-center gap-4 border-b pb-4"
            >
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
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
