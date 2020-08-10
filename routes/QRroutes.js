"use strict";

const QRController = require("../controllers/QRController");
const express = require("express");
const api = express.Router();
const verifyToken = require("../middelwares/verifyToken");

api.get("/get-qr", [verifyToken.checkTokens], QRController.getQRCode);
api.post(
  "/verify-temperature",
  [verifyToken.checkTokens],
  QRController.verifyTemperature
);

module.exports = api;
