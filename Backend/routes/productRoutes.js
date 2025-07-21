const express = require("express");
const Product = require("../models/product");
const { protect, admin } = require("../middleware/authmiddleware");

const router = express.Router();

// ========== CREATE PRODUCT (ADMIN) ==========
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name, description, price, discountPrice,
      countInStock, category, brand, sizes, colors, collections,
      material, gender, images, isFeatured, isPublished,
      tags, dimension, weight, sku,
    } = req.body;

    const product = new Product({
      name, description, price, discountPrice,
      countInStock, category, brand, sizes, colors, collections,
      material, gender, images, isFeatured, isPublished,
      tags, dimension, weight, sku,
      user: req.user._id
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ========== GET BEST SELLER ==========
router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    if (!bestSeller)
      return res.status(400).json({ message: "Best Seller not available" });

    res.json(bestSeller); // ✅ FIXED
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ========== GET NEW ARRIVALS ==========
router.get("/new-arrival", async (req, res) => {
  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    if (!newArrivals || newArrivals.length === 0)
      return res.status(400).json({ message: "New Arrivals not available" });

    res.json(newArrivals); // ✅ FIXED
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ========== GET SIMILAR PRODUCTS ==========
router.get("/similar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ message: "Product Not Found" });

    const similarProducts = await Product.find({
      _id: { $ne: id },
      gender: product.gender,
      category: product.category
    }).limit(4);

    res.json(similarProducts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ========== UPDATE PRODUCT ==========
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name, description, price, discountPrice,
      countInStock, category, brand, sizes, colors, collections,
      material, gender, images, isFeatured, isPublished,
      tags, dimension, weight, sku,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discountPrice = discountPrice || product.discountPrice;
    product.countInStock = countInStock || product.countInStock;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.sizes = sizes || product.sizes;
    product.colors = colors || product.colors;
    product.collections = collections || product.collections;
    product.material = material || product.material;
    product.gender = gender || product.gender;
    product.images = images || product.images;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
    product.tags = tags || product.tags;
    product.dimension = dimension || product.dimension;
    product.weight = weight || product.weight;
    product.sku = sku || product.sku;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ========== DELETE PRODUCT ==========
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product Not Found" });

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ========== GET ALL PRODUCTS WITH FILTER ==========
router.get("/", async (req, res) => {
  try {
    const {
      collection, size, color, gender, minPrice, maxPrice,
      sortBy, search, category, material, brand, limit
    } = req.query;

    let query = {};

    if (collection && collection.toLowerCase() !== "all") query.collection = collection;
    if (category && category.toLowerCase() !== "all") query.category = category;
    if (material) query.material = { $in: material.split(",") };
    if (brand) query.brand = { $in: brand.split(",") };
    if (size) query.sizes = { $in: size.split(",") };
    if (color) query.colors = { $in: [color] };
    if (gender) query.gender = gender;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    let sort = {};
    switch (sortBy) {
      case "priceAsc":
        sort = { price: 1 };
        break;
      case "priceDesc":
        sort = { price: -1 };
        break;
      case "popularity":
        sort = { rating: -1 };
        break;
    }

    const products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ========== GET SINGLE PRODUCT (KEEP THIS LAST) ==========
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product Not Found" });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
