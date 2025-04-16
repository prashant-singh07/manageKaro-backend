const db = require("../models/db");
const skuQueries = require("../queries/skuQueries");

const skuController = {
  addSku: async (req, res, next) => {
    const { user_id, shop_id, name, type, kind, size, ideal_selling_price } =
      req.body;
    try {
      // Validate required fields
      if (
        !user_id ||
        !shop_id ||
        !name ||
        !type ||
        !kind ||
        !size ||
        !ideal_selling_price
      ) {
        return res.status(400).json({
          message: "Missing required fields",
          description:
            "user_id, shop_id, name, type, kind, size and ideal_selling_price are required",
          data: null,
        });
      }

      const result = await db.query(
        "INSERT INTO sku (created_id, shop_id, name, type, kind, size, ideal_selling_price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [user_id, shop_id, name, type, kind, size, ideal_selling_price]
      );

      res.status(201).json({
        message: "Product added successfully",
        description: "New Product added to the shop",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error creating sku:", error);
      res.status(500).json({
        message: "Server Error",
        description: error.message,
        data: null,
      });
    }
  },

  getAllSkus: async (req, res, next) => {
    try {
      const { shop_id } = req.body;

      // Validate required fields
      if (!shop_id) {
        return res.status(400).json({
          message: "Missing required fields",
          description: "shop_id is required",
          data: null,
        });
      }

      const skus = await skuQueries.getSkusByShop(shop_id);

      return res.status(200).json({
        message: "SKUs retrieved successfully",
        description: "List of all SKUs for the shop",
        data: skus,
      });
    } catch (error) {
      console.error("Error fetching SKUs:", error);
      return res.status(500).json({
        message: "Server Error",
        description: error.message,
        data: null,
      });
    }
  },

  getSkuById: async (req, res, next) => {
    try {
      const { shop_id } = req.body;
      const { sku_id } = req.params;

      // Validate required fields
      if (!shop_id || !sku_id) {
        return res.status(400).json({
          message: "Missing required fields",
          description: "shop_id and sku_id are required",
          data: null,
        });
      }

      const sku = await skuQueries.getSkuById(sku_id, shop_id);

      if (!sku) {
        return res.status(404).json({
          message: "SKU not found",
          description: "No SKU exists with the provided ID",
          data: null,
        });
      }

      return res.status(200).json({
        message: "SKU retrieved successfully",
        description: "SKU details",
        data: sku,
      });
    } catch (error) {
      console.error("Error fetching SKU:", error);
      return res.status(500).json({
        message: "Server Error",
        description: error.message,
        data: null,
      });
    }
  },
};

module.exports = skuController;
