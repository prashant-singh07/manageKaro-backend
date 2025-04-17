const db = require("../models/db");
const supplierQueries = require("../queries/supplierQueries");

const supplierController = {
  getAllSuppliers: async (req, res, next) => {
    const { user_id, shop_id } = req.body;
    try {
      // Validate required fields
      if (!shop_id || !user_id) {
        return res.status(400).json({
          message: "Missing required fields",
          description: "user_id or shop_id is required",
          data: null,
        });
      }

      const allSuppliers = await supplierQueries.getSuppliersByUserAndShop(
        user_id,
        shop_id
      );

      if (!allSuppliers) {
        return res.status(404).json({
          message: "No suppliers found",
          description: "No suppliers found for the user and shop",
          data: null,
        });
      }
      return res.status(200).json({
        message: "Suppliers retrieved successfully",
        description: "List of all suppliers for the shop",
        data: allSuppliers,
      });
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      return res.status(500).json({
        message: "Server Error",
        description: error.message,
        data: null,
      });
    }
  },

  addSupplier: async (req, res, next) => {
    const { user_id, shop_id, name, mobile, address, email_id, gst_number } =
      req.body;
    try {
      // Validate required fields
      if (!user_id || !shop_id || !name || !mobile || !address) {
        return res.status(400).json({
          message: "Missing required fields",
          description:
            "user_id, shop_id, supplier_id, name, mobile, and address are required",
          data: null,
        });
      }

      const addedSupplier = await supplierQueries.addSupplier(
        user_id,
        shop_id,
        name,
        mobile,
        address,
        email_id,
        gst_number
      );

      if (!addedSupplier) {
        return res.status(404).json({
          message: "Supplier not found",
          description: "Supplier with the given ID not found",
          data: null,
        });
      }

      return res.status(200).json({
        message: "Supplier added successfully",
        description: "New supplier has been created",
        data: addedSupplier,
      });
    } catch (error) {
      console.error("Error updating supplier:", error);
      return res.status(500).json({
        message: "Server Error",
        description: error.message,
        data: null,
      });
    }
  },
};

module.exports = supplierController;
