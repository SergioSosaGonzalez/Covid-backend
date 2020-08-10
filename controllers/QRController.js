"use strict";
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const { QR, User } = require("../models/schema");
require("dotenv").config();

const getQRCode = async (req, resp) => {
  const { id } = req.user;
  let qrFound = await QR.findOne({ userId: id });

  if (qrFound)
    return resp
      .status(200)
      .send({ qr: qrFound.code, message: "Code generate successfully" });

  let token = await jwt.sign({ id }, process.env.JWT_QRCODE, {
    expiresIn: "1h",
  });

  if (token) {
    let qrCode = await QRCode.toDataURL(token);
    if (qrCode) {
      let qrModel = new QR({
        code: qrCode,
        token,
        userId: id,
      });
      let qrStored = await qrModel.save();
      if (qrStored)
        return resp
          .status(200)
          .send({ qr: qrCode, message: "Code generate successfully" });
    }
  }
  return resp.status(500).send({ message: "Error when generate qr" });
};

const verifyTemperature = async (req, resp) => {
  let { info, temp } = req.body;
  let qrStored = await QR.findOne({ token: info });
  if (qrStored) {
    let payload = await jwt.decode(info, process.env.JWT_QRCODE);
    if (payload) {
      let userUpdated = await User.findByIdAndUpdate(payload.id, {
        temperature: { number: temp, lastDate: Date.now() },
      });
      if (userUpdated) {
        await QR.findByIdAndDelete(qrStored._id);
        return resp.status(200).send({ message: "Temperature registered" });
      }
    }
  }

  return resp
    .status(403)
    .send({ message: "Error when you save the temperature" });
};
module.exports = { getQRCode, verifyTemperature };
