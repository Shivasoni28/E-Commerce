const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Product = require("../models/productModel");
const { faker } = require("@faker-js/faker");
const axios = require("axios");

dotenv.config();
connectDB();



const seedProducts = async () => {
  try {
    await Product.deleteMany();
    const { data } = await axios.get("https://fakestoreapi.com/products");

     const fakeProducts = data.map((item) => ({
      name: item.title,
      description: item.description,
      price: Math.round(item.price * 80), // convert to INR approx
      image: item.image,
      category: item.category,
      brand: "FakeStore", // optional field
      countInStock: item.rating.count, // add fake stock
    }));

     await Product.insertMany(fakeProducts);
    console.log("Fake products seeded!");
    process.exit();
  } catch (error) {
    console.error(`Error seeding products: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();
