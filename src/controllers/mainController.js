const db = require("../models/db");

const mainController = {
  // Get all items
  getAllItems: async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM your_table");
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  },

  // Create a new item
  createItem: async (req, res) => {
    const { name, description } = req.body;

    try {
      const result = await db.query(
        "INSERT INTO your_table (name, description) VALUES ($1, $2) RETURNING *",
        [name, description]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating item:", error);
      res.status(500).json({ error: "Failed to create item" });
    }
  },
};

module.exports = mainController;
