const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subcriberRoutes = require("./routes/subscriberRoute");

const adminRoutes = require("./routes/adminRoutes");
const ProductadminRoutes = require("./routes/ProductadminRoutes");
const adminOrderRoutes = require("./routes/adminorderRoutes");

dotenv.config(); // load .env early

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("WELCOME TO APNIDUKAAN APP");
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscribe", subcriberRoutes);

// Admin Routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", ProductadminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// Startup Function
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1); // stop deployment gracefully
  }
}

startServer();
