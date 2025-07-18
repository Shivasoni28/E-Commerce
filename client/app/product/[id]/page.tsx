"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category?: string;
  brand?: string;
  countInStock?: number;
}

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get<Product[]>(
          "http://localhost:5000/api/products"
        );
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const product = products.find((p) => p._id === id);

  if (loading) {
    return <div className="p-6 text-gray-500 text-center">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="p-6 text-red-500 font-semibold text-center">
        Product not found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Product Image */}
        <div className="flex-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[400px] object-contain bg-gray-100 rounded-lg shadow-md"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            {product.description}
          </p>

          <p className="text-2xl font-semibold text-blue-600 mb-4">
            ₹{product.price}
          </p>

          <p className="text-sm text-gray-500 mb-6">
            Category:{" "}
            <span className="capitalize font-medium text-gray-700">
              {product.category || "Uncategorized"}
            </span>
          </p>

          {/* Add to Cart Button */}
          <button className="w-full md:w-1/2 bg-blue-600 text-white text-lg px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
