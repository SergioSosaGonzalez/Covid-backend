const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  password: String,
  area: String,
  cargo: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
