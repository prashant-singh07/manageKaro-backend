const db = require("../models/db");
const skuQueries = require("../queries/skuQueries");

const skuController = {
  addNewSku: async (req, res) => {
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

      const addedSku = await skuQueries.addNewSku(
        user_id,
        shop_id,
        name,
        type,
        kind,
        size,
        ideal_selling_price
      );

      if (!addedSku) {
        return res.status(404).json({
          message: "SKU not added",
          description: "SKU couldn't be added",
          data: null,
        });
      }
      res.status(201).json({
        message: "Product added successfully",
        description: "New Product added to the shop",
        data: addedSku,
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
      const { user_id, shop_id } = req.body;

      // Validate required fields
      if (!user_id || !shop_id) {
        return res.status(400).json({
          message: "Missing required fields",
          description: "user_id, shop_id are required",
          data: null,
        });
      }

      const skus = await skuQueries.getSkusByUserAndShop(user_id, shop_id);

      if (!skus) {
        return res.status(404).json({
          message: "No SKUs found",
          description: "No SKUs found for the shop",
          data: null,
        });
      }
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
};

module.exports = skuController;
