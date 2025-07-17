"use client";
import { useEffect, useState,use} from "react";
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
    return <div className="p-6 text-gray-500">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="p-6 text-red-500 font-semibold">Product not found.</div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 h-96 object-cover rounded"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-xl font-semibold mb-2">Price: ₹{product.price}</p>
          <p className="text-sm text-gray-500">Category: {product.category}</p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
