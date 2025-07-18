"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {useSearchContext} from "../app/context/searchContext";

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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { search,  category} = useSearchContext();

  const categories = [
    "All",
    "Footwear",
   "men's clothing",
    "electronics",
    "women's clothing",
    "jewelery",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

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

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🛍️ Product List</h1>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse border p-4 rounded shadow">
              <div className="bg-gray-300 h-48 w-full rounded mb-2" />
              <div className="h-4 bg-gray-300 rounded mb-1 w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-2/4 mb-2" />
              <div className="h-4 bg-gray-400 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product._id} href={`/product/${product._id}`}>
              <div
                className="border p-4 rounded shadow hover:shadow-lg transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover mb-3 rounded"
                />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {product.description}
                </p>
                <p className="font-bold mt-2 text-blue-600">₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
