"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axiosInstance from "../utils/axiosInstance";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  updateQuantity: (id: string, type: "increment" | "decrement") => void;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalPrice: number;
  placeOrder: (shippingAddress: string, paymentMethod?: "cod" | "online") => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const fetchCart = async () => {
    try {
      const { data } = await axiosInstance.get("/cart");
      setCart(data.items || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart([]);
    }
  };

  const addToCart = async (item: CartItem) => {
    try {
      await axiosInstance.post("/cart/add", item, { withCredentials: true });
      await fetchCart(); // Always refetch to keep populated product details
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await axiosInstance.delete(`/cart/remove/${id}`, { withCredentials: true });
      await fetchCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  
const clearCart = async () => {
  try {
    const validItems = cart.filter((item) => item.product?._id); // skip invalid items

    await Promise.all(
      validItems.map((item) =>
        axiosInstance
          .delete(`/cart/remove/${item.product._id}`, { withCredentials: true })
          .catch((err) => {
            console.error(`Failed to remove ${item.product._id}:`, err?.response?.data || err.message);
          })
      )
    );

    setCart([]); // Clear local cart even if API partially fails
  } catch (error) {
    console.error("Failed to clear cart:", error);
  }
};



  const updateQuantity = (id: string, type: "increment" | "decrement") => {
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + (type === "increment" ? 1 : -1)) }
          : item
      )
    );
  };
  const placeOrder = async (shippingAddress: string, paymentMethod: "cod" | "online" = "cod") => {
  try {
    const { data } = await axiosInstance.post(
      "/orders",
      { shippingAddress, paymentMethod },
      { withCredentials: true }
    );

    // Clear cart after order
    setCart([]);
    return data;
  } catch (error: any) {
    console.error("Failed to place order:", error.response?.data || error.message);
    throw error;
  }
};

  useEffect(() => {
    fetchCart();
  }, []);

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
         placeOrder, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
