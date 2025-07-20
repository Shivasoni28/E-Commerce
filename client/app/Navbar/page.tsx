"use client";
import React, { useState } from "react";
import { Search, Package, User, ShoppingCart } from "lucide-react";
import { useSearchContext } from "../context/searchContext";
import Link from "next/link";
import { useCart } from "../context/cartContext";

const Navbar = () => {
  const { search, setSearch, category, setCategory } = useSearchContext();
  const [clicked, setClicked] = useState(false);
  const { cart } = useCart();
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const categories = [
    "All",
    "Footwear",
    "men's clothing",
    "electronics",
    "women's clothing",
    "jewelery",
  ];

  return (
    <div className="w-full border-b border-gray-200 shadow-sm bg-white">
      <div className="flex items-center justify-between px-6 py-4 relative">
        {/* Logo */}
        <div className="flex gap-2 items-center">
          <Package className="h-8 w-8 text-blue-600" />
          <span className="font-bold text-2xl">ShopHub</span>
        </div>

        {/* Nav Links */}
        <ul className="hidden md:flex items-center font-semibold gap-6">
          <Link href="/"><li className="hover:text-blue-500 cursor-pointer">Shop</li></Link>
          <li className="hover:text-blue-500 cursor-pointer">Categories</li>
          <li className="hover:text-blue-500 cursor-pointer">Deals</li>
          <li className="hover:text-blue-500 cursor-pointer">About</li>
          <li className="hover:text-blue-500 cursor-pointer">Contact</li>
        </ul>

        {/* Right Section (Search + Icons) */}
        <div className="flex items-center gap-4 w-full max-w-lg justify-end">
          {/* Search + Category */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            {/* Category Dropdown */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border border-gray-300 rounded bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded w-full focus:outline-none"
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 relative">
             <Link href="/cart" className="relative">
        <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-blue-500" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Link>
            <User
              className="h-6 w-6 text-gray-700 cursor-pointer hover:text-blue-500"
              onClick={() => setClicked(!clicked)}
            />

            {/* Dropdown */}
            {clicked && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 shadow-xl rounded-lg mt-2 w-40 z-50">
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Orders</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link href="/register" className="block w-full">
                      Sign In
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link href="/register" className="block w-full">
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
