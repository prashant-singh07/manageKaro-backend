const db = require("../models/db");
const bcrypt = require("bcrypt");
// const { isEmpty } = require("lodash");

const authController = {
  register: async (req, res, next) => {
    const { mobile, password } = req.body;
    try {
      // 1. Check if user already exists
      const userCheck = await db.query(
        "SELECT * FROM users WHERE mobile = $1",
        [mobile]
      );

      if (userCheck.rows.length > 0) {
        const response = {
          message: "User already exists with this mobile number",
          description: "Please try to login with your mobile number",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      // 2. Insert new user
      const newUser = await db.query(
        `INSERT INTO users (mobile, password) 
         VALUES ($1, $2) RETURNING *`,
        [mobile, password]
      );

      const response = {
        message: "User registered successfully",
        description: "User registered successfully",
        data: { user_id: newUser.rows[0].id },
      };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { mobile, password } = req.body;
      const userRegisteredResult = await db.query(
        "SELECT * FROM users WHERE mobile = $1",
        [mobile]
      );
      const userRegistered = userRegisteredResult.rows[0];

      const userResult = await db.query(
        "SELECT * FROM users WHERE mobile = $1 AND password = $2",
        [mobile, password]
      );
      const userData = userResult.rows[0];

      if (!userData) {
        if (!userRegistered) {
          const response = {
            message: "Invalid Credentials",
            description: `Please sign up to continue.`,
            data: null,
          };
          res.status(404).json(response);
          return;
        }

        const response = {
          message: "Invalid Credentials",
          description: "Password is incorrect.",
          data: null,
        };
        res.status(401).json(response);
        return;
      }

      const { id, password: _, created_at, updated_at, ...rest } = userData;
      const {
        // mobile,
        // email_id,
        name,
        // gender,
        // dob,
        // address,
        // role,
        // gst_number,
        // profile_image,
        shop_id,
      } = rest;
      if (!name || name.trim() === "") {
        res.status(200).json({
          message: "Profile Incomplete",
          description: "The user has not yet provided a name.",
          data: {
            user_id: id,
            is_profile_completed: false,
            is_shop_linked: false,
            ...rest,
          },
        });
        return;
      }

      if (!shop_id || shop_id.length === 0) {
        res.status(200).json({
          message: "Shop not added",
          description: "The user has not yet linked a shop.",
          data: {
            user_id: id,
            is_profile_completed: true,
            is_shop_linked: false,
            ...rest,
          },
        });
        return;
      }

      const response = {
        message: "Login successful",
        description: "User logged in successfully",
        data: {
          user_id: id,
          is_profile_completed: true,
          is_shop_linked: true,
          ...rest,
        },
      };
      res.status(200).json(response);
      return;
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
