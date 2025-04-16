const authQueries = require("../queries/authQueries");

const authController = {
  register: async (req, res, next) => {
    const { mobile, password } = req.body;
    try {
      // 1. Check if user already exists
      const existingUser = await authQueries.getUserByMobile(mobile);

      if (existingUser) {
        const response = {
          message: "User already exists with this mobile number",
          description: "Please try to login with your mobile number",
          data: null,
        };
        return res.status(400).json(response);
      }

      // 2. Insert new user
      const newUser = await authQueries.createUser({ mobile, password });

      const { id, password: _, created_at, updated_at, ...rest } = newUser;
      const { name, shop_id } = rest;
      const response = {
        message: "User registered successfully",
        description: "User registered successfully",
        data: {
          user_id: id,
          is_profile_completed: name ? true : false,
          is_shop_linked: shop_id ? true : false,
          ...rest,
        },
      };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { mobile, password } = req.body;

      // Check if user exists
      const existingUser = await authQueries.getUserByMobile(mobile);

      // Check credentials
      const userData = await authQueries.getUserByMobileAndPassword(
        mobile,
        password
      );

      if (!userData) {
        if (!existingUser) {
          const response = {
            message: "Invalid Credentials",
            description: `Please sign up to continue.`,
            data: null,
          };
          return res.status(404).json(response);
        }

        const response = {
          message: "Invalid Credentials",
          description: "Password is incorrect.",
          data: null,
        };
        return res.status(401).json(response);
      }

      const { id, password: _, created_at, updated_at, ...rest } = userData;
      const { name, shop_id } = rest;

      const isProfileComplete = name?.trim()?.length > 0;
      const isShopLinked = shop_id && shop_id.length > 0;
      if (!isProfileComplete) {
        return res.status(200).json({
          message: "Profile Incomplete",
          description: "The user has not yet provided a name.",
          data: {
            user_id: id,
            is_profile_completed: isProfileComplete,
            is_shop_linked: isShopLinked,
            ...rest,
          },
        });
      }

      if (!isShopLinked) {
        return res.status(200).json({
          message: "Shop not added",
          description: "The user has not yet linked a shop.",
          data: {
            user_id: id,
            is_profile_completed: isProfileComplete,
            is_shop_linked: isShopLinked,
            ...rest,
          },
        });
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
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
