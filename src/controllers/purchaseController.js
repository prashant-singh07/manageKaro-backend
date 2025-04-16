const db = require("../models/db");

const purchaseController = {
  addPurchase: async (req, res, next) => {
    const {
      user_id,
      shop_id,
      supplier_id,
      purchase_date,
      payment_mode,
      purchase_items,
    } = req.body;
    try {
      // Validate required fields
      if (
        !user_id ||
        !shop_id ||
        !supplier_id ||
        !purchase_date ||
        !payment_mode ||
        !purchase_items
      ) {
        return res.status(400).json({
          message: "Missing required fields",
          description:
            "user_id, shop_id, name, mobile and address are required",
          data: null,
        });
      }

      const total_quantity = purchase_items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      const total_amount = purchase_items.reduce(
        (acc, item) => acc + item.cost_price * item.quantity,
        0
      );

      const purchaseResult = await db.query(
        "INSERT INTO purchase (created_id, shop_id, supplier_id, purchase_date, payment_mode, total_quantity, total_amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [
          user_id,
          shop_id,
          supplier_id,
          purchase_date,
          payment_mode,
          total_quantity,
          total_amount,
        ]
      );

      const skuIds = purchase_items.map((item) => item.sku_id);
      const getSkuResult = await db.query(
        "SELECT * FROM sku WHERE id = ANY($1)",
        [skuIds]
      );

      const skuData = getSkuResult.rows;

      purchase_items.forEach(async (item, index) => {
        const purchase_items_result = await db.query(
          "INSERT INTO purchaseitems ( po_id, sku_id, quantity, cost_price, ideal_selling_price) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [
            purchaseResult.rows[0].id,
            item.sku_id,
            item.quantity,
            item.cost_price,
            skuData.find((sku) => sku.id === item.sku_id).ideal_selling_price,
          ]
        );
      });

      res.status(201).json({
        message: "Purchase Order added successfully",
        description: "New Purchase Order has been created",
        data: purchaseResult.rows[0],
      });
    } catch (error) {
      console.error("Error creating purchase order:", error);
      res.status(500).json({
        message: "Server Error",
        description: error.message,
        data: null,
      });
    }
  },
  getPurchase: async (req, res, next) => {
    const { user_id, shop_id } = req.body;
    try {
      const purchaseResult = await db.query(
        "SELECT * FROM purchase WHERE created_id = $1 AND shop_id = $2",
        [user_id, shop_id]
      );
      if (purchaseResult.rows.length === 0) {
        return res.status(400).json({
          message: "No Purchase Order found",
          description: "No Purchase Order found",
          data: null,
        });
      }
      res.status(200).json({
        message: "Purchase Order found",
        description: "Purchase Order found",
        data: purchaseResult.rows,
      });
    } catch (error) {
      next(error);
    }
  },
};
module.exports = purchaseController;
