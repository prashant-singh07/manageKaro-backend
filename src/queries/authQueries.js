const supabase = require("../config/supabase");

const authQueries = {
  async getUserByMobile(mobile) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("mobile", mobile)
      .single();

    if (error) {
      console.log("Error getUserByMobile", error);
      return null;
    }
    console.log("Data getUserByMobile", data);
    return data;
  },

  async createUser(userData) {
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.log("Error createUser", error);
      return null;
    }
    console.log("Data createUser", data);
    return data;
  },

  async getUserByMobileAndPassword(mobile, password) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("mobile", mobile)
      .eq("password", password)
      .single();

    if (error) {
      console.log("Error getUserByMobileAndPassword", error);
      return null;
    }
    console.log("Data getUserByMobileAndPassword", data);
    return data;
  },
};

module.exports = authQueries;
