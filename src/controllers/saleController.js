const db = require("../models/db");
// const { isEmpty } = require("lodash");

const saleController = {
  addSales: async (req, res, next) => {
    const {
      user_id,
      shop_id,
      customer_mobile,
      customer_name,
      sale_date,
      payment_mode,
      sale_items,
    } = req.body;
    try {
      if (
        !user_id ||
        !shop_id ||
        !customer_mobile ||
        !customer_name ||
        !payment_mode ||
        !sale_date ||
        !sale_items
      ) {
        return res.status(400).json({
          message: "Missing required fields",
          description:
            "user_id, shop_id, name, mobile and address are required",
          data: null,
        });
      }

      const sale_quantity = sale_items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      const sale_amount = sale_items.reduce(
        (acc, item) => acc + item.selling_price * item.quantity,
        0
      );

      const sale_discount = sale_items.reduce(
        (acc, item) => acc + item.ideal_selling_price - item.selling_price,
        0
      );

      // 1. Ch
      // eck if
      // user already exists
      const saleResult = await db.query(
        "INSERT INTO sales (created_id, shop_id, customer_mobile, customer_name, sale_date, payment_mode, sale_amount, sale_discount, sale_quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        [
          user_id,
          shop_id,
          customer_mobile,
          customer_name,
          sale_date,
          payment_mode,
          sale_amount,
          sale_discount,
          sale_quantity,
        ]
      );

      sale_items.forEach(async (item, index) => {
        const sale_items_result = await db.query(
          "INSERT INTO salesitems ( sale_id, sku_id, quantity, selling_price, discount) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [
            saleResult.rows[0].id,
            item.sku_id,
            item.quantity,
            item.selling_price,
            item.ideal_selling_price - item.selling_price,
          ]
        );
      });

      res.status(201).json({
        message: "Sales added successfully",
        description: "Sales added successfully",
        data: saleResult.rows[0],
      });
    } catch (err) {
      next(err);
    }
  },
  getSales: async (req, res, next) => {
    const { user_id, shop_id } = req.body;
    try {
      const saleResult = await db.query(
        "SELECT * FROM sales WHERE created_id = $1 AND shop_id = $2",
        [user_id, shop_id]
      );
      if (saleResult.rows.length === 0) {
        return res.status(400).json({
          message: "No Sales found",
          description: "No Sales found",
          data: null,
        });
      }
      res.status(200).json({
        message: "Sales returned successfully",
        description: "Sales returned successfully",
        data: saleResult.rows,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = saleController;
