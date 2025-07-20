"use client";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/orders", { withCredentials: true });
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-semibold text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg shadow">
          <p className="text-lg text-gray-500">You haven’t placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg shadow-md p-5 bg-white hover:shadow-lg transition"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center border-b pb-3 mb-3">
                <p className="text-gray-600 text-sm">
                  <b>Order ID:</b> {order._id}
                </p>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status || "Processing"}
                </span>
              </div>

              {/* Order Info */}
              <div className="mb-3 text-gray-700">
                <p className="text-lg font-semibold">Total: ₹{order.totalAmount}</p>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>

              {/* Items */}
              <h4 className="text-md font-semibold mb-2">Items:</h4>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div
                    key={item.product._id}
                    className="flex items-center gap-4 border-b pb-2 last:border-none"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-gray-600 text-sm">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
