const mongoose = require("mongoose");
const schema = mongoose.Schema;
const qrSchema = new mongoose.Schema({
  code: String,
  token: String,
  userId: { type: schema.ObjectId, ref: "User" },
  expire_at: { type: Date, default: Date.now, expires: 3600 },
});

const QR = mongoose.model("QRCode", qrSchema);
module.exports = QR;
