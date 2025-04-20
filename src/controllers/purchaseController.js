const purchaseQueries = require("../queries/purchaseQueries");

const purchaseController = {
  createPurchaseOrder: async (req, res, next) => {
    const {
      user_id,
      shop_id,
      supplier_id,
      purchase_date,
      payment_mode,
      purchase_items,
      total_amount,
      total_quantity,
    } = req.body;
    try {
      // Validate required fields
      console.log(req.body);
      if (
        !user_id ||
        !shop_id ||
        !supplier_id ||
        !purchase_date ||
        !payment_mode ||
        !purchase_items ||
        !total_amount ||
        !total_quantity
      ) {
        return res.status(400).json({
          message: "Missing required fields",
          description:
            "user_id, shop_id, supplier_id, purchase_date, payment_mode, purchase_items, total_amount and total_quantity are required",
          data: null,
        });
      }

      const purchaseResult = await purchaseQueries.createPurchaseOrder(
        user_id,
        shop_id,
        supplier_id,
        purchase_date,
        payment_mode,
        total_amount,
        total_quantity
      );

      if (!purchaseResult) {
        return res.status(400).json({
          message: "Failed to create purchase order",
          description: "Failed to create purchase order",
          data: null,
        });
      }

      const purchaseItems = purchase_items.map((item) => ({
        po_id: purchaseResult.id,
        sku_id: item.sku_id,
        cost_price: item.cost_price,
        quantity: item.quantity,
      }));
      const purchaseItemsResult = await purchaseQueries.createPurchaseItems(
        purchaseItems
      );

      if (!purchaseItemsResult) {
        return res.status(400).json({
          message: "Failed to create purchase items",
          description: "Failed to create purchase items",
          data: null,
        });
      }
      return res.status(200).json({
        message: "Purchase order created successfully",
        description: "Purchase order created successfully",
        data: purchaseResult,
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
