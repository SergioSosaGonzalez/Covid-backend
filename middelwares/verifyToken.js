"use strict";
require("dotenv").config();
const { User } = require("../models/schema");
const jwt = require("jsonwebtoken");
const checkTokens = async (req, resp, next) => {
  const token = req.header("Authorization");
  if (!token)
    return resp.status(200).send({ message: "Token invalid", code: 403 });
  else {
    let verifyToken = token.split(" ")[1];
    if (!verifyToken)
      return resp.status(200).send({ message: "Token invalid", code: 403 });
    try {
      const payload = jwt.verify(verifyToken, process.env.JWT_CODE);
      if (payload) {
        let user = await User.findOne({ _id: payload.id });
        if (!user)
          return resp.status(200).send({
            message: "Token invalid",
            type: "INVALID_TOKEN",
            code: 403,
          });
        else {
          req.user = payload;
        }
        next();
      } else
        return resp
          .status(200)
          .send({ message: "Token invalid", type: "INVALID_TOKEN", code: 403 });
    } catch (e) {
      return resp
        .status(200)
        .send({ message: "Token invalid", type: "INVALID_TOKEN", code: 403 });
    }
  }
};

module.exports = { checkTokens };
