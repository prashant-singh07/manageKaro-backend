const db = require("../models/db");
const saleQueries = require("../queries/saleQueries");
// const { isEmpty } = require("lodash");

const saleController = {
  getAllSales: async (req, res, next) => {
    const { user_id, shop_id } = req.body;
    try {
      if (!user_id || !shop_id) {
        return res.status(400).json({
          message: "Missing required fields",
          description: "user_id and shop_id are required",
          data: null,
        });
      }

      const salesResult = await saleQueries.getAllSales(user_id, shop_id);
      if (!salesResult || salesResult.length === 0) {
        return res.status(400).json({
          message: "No Sales Order found",
          description: "No Sales Order found",
          data: null,
        });
      }

      // Fetch supplier data for each purchase
      // const purchaseResultWithSupplier = await Promise.all(
      //   salesResult.map(async (purchase) => {
      //     const supplierData = await supplierQueries.getSupplierById(
      //       purchase.supplier_id
      //     );
      //     return {
      //       ...purchase,
      //       supplier: supplierData || null,
      //     };
      //   })
      // );

      return res.status(200).json({
        message: "Sales orders fetched successfully",
        description: "Sales orders fetched successfully",
        data: salesResult,
      });
    } catch (error) {
      console.error("Error fetching sales orders:", error);
      res.status(500).json({
        message: "Server Error",
        description: error.message,
        data: null,
      });
    }
  },
  createSaleOrder: async (req, res, next) => {
    const {
      user_id,
      shop_id,
      customer_name,
      customer_mobile,
      sale_date,
      sale_amount,
      sale_quantity,
      payment_mode,
      sales_items,
    } = req.body;
    try {
      if (
        !user_id ||
        !shop_id ||
        !customer_mobile ||
        !customer_name ||
        !sale_date ||
        !sale_amount ||
        !sale_quantity ||
        !payment_mode ||
        !sales_items
      ) {
        return res.status(400).json({
          message: "Missing required fields",
          description:
            "user_id, shop_id, name, mobile and address are required",
          data: null,
        });
      }

      const salesResult = await saleQueries.createSaleOrder(
        user_id,
        shop_id,
        customer_name,
        customer_mobile,
        sale_date,
        sale_amount,
        sale_quantity,
        payment_mode
      );
      if (!salesResult) {
        return res.status(400).json({
          message: "Failed to create sale order",
          description: "Failed to create sale order",
          data: null,
        });
      }
      const salesItems = sales_items.map((item) => ({
        created_id: user_id,
        sales_id: salesResult.id,
        sku_id: item.sku_id,
        quantity: item.quantity,
        selling_price: item.selling_price,
      }));
      const saleItemsResult = await saleQueries.createSaleItems(salesItems);

      if (!saleItemsResult) {
        return res.status(400).json({
          message: "Failed to create sale order item",
          description: "Failed to create sale order item",
          data: null,
        });
      }
      return res.status(200).json({
        message: "Sale order created successfully",
        description: "Sale order created successfully",
        data: { ...salesResult, sale_items: saleItemsResult },
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = saleController;
