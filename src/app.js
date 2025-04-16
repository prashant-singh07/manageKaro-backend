const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const supplierRoutes = require("./routes/supplier");
const skuRoutes = require("./routes/sku");
const purchaseRoutes = require("./routes/purchase");
const saleRoutes = require("./routes/sale");
const profileRoutes = require("./routes/profile");
const shopRoutes = require("./routes/shop");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/supplier", supplierRoutes);
app.use("/sku", skuRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/sale", saleRoutes);
app.use("/shop", shopRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
