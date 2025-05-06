const purchaseQueries = require("../queries/purchaseQueries");
const supplierQueries = require("../queries/supplierQueries");
const skuQueries = require("../queries/skuQueries");
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

  getAllPurchase: async (req, res, next) => {
    const { user_id, shop_id } = req.body;
    try {
      if (!user_id || !shop_id) {
        return res.status(400).json({
          message: "Missing required fields",
          description: "user_id and shop_id are required",
          data: null,
        });
      }

      const purchaseResult = await purchaseQueries.getAllPurchase(
        user_id,
        shop_id
      );
      if (!purchaseResult || purchaseResult.length === 0) {
        return res.status(400).json({
          message: "No Purchase Order found",
          description: "No Purchase Order found",
          data: null,
        });
      }

      // Fetch supplier data for each purchase
      const purchaseResultWithSupplier = await Promise.all(
        purchaseResult.map(async (purchase) => {
          const supplierData = await supplierQueries.getSupplierById(
            purchase.supplier_id
          );
          return {
            ...purchase,
            supplier: supplierData || null,
          };
        })
      );

      return res.status(200).json({
        message: "Purchase orders fetched successfully",
        description: "Purchase orders fetched successfully",
        data: purchaseResultWithSupplier,
      });
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      res.status(500).json({
        message: "Server Error",
        description: error.message,
        data: null,
      });
    }
  },

  getPurchaseDetails: async (req, res, next) => {
    const { po_id } = req.body;
    try {
      if (!po_id) {
        return res.status(400).json({
          message: "Missing required fields",
          description: "po_id is required",
          data: null,
        });
      }

      const purchaseDetails = await purchaseQueries.getPurchaseDetails(po_id);
      if (!purchaseDetails) {
        return res.status(400).json({
          message: "Purchase details not found",
          description: "Purchase details not found",
          data: null,
        });
      }

      const purchaseDetailsWithSku = await Promise.all(
        purchaseDetails.map(async (item) => {
          const skuData = await skuQueries.getSkuDetails(item.sku_id);
          return {
            ...item,
            sku: skuData || null,
          };
        })
      );
      return res.status(200).json({
        message: "Purchase details fetched successfully",
        description: "Purchase details fetched successfully",
        data: purchaseDetailsWithSku,
      });
    } catch (error) {
      console.error("Error fetching purchase details:", error);
      res.status(500).json({
        message: "Server Error",
        description: error.message,
        data: null,
      });
    }
  },
};
module.exports = purchaseController;
