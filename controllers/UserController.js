"use strict";

const { User, UserBlock } = require("../models/schema");
const { validationResult } = require("express-validator");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const salt = bcrypt.genSaltSync(12);

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  let { email, password } = req.body;
  let userBlockStored = null;
  let user = await User.findOne({ email });
  if (!user)
    return res
      .status(200)
      .send({ message: "User or password not correct", code: 404 });
  let verifyUserBlock = await UserBlock.findOne({ userId: user._id });
  if (verifyUserBlock) {
    userBlockStored = verifyUserBlock;
    if (verifyUserBlock.status === "BLOCK")
      return res.status(200).send({
        message: "User block after many attemps, please try later",
        code: 403,
      });
  } else {
    let userBlock = new UserBlock({
      userId: user._id,
    });
    userBlockStored = await userBlock.save();
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (validPassword) {
    const token = await jwt.sign(
      {
        id: user._id,
        name: user.firstname,
        lastname: user.lastname,
      },
      process.env.JWT_CODE
    );
    return res.status(200).send({
      token,
      user: { name: user.firstname, email: user.email },
      code: 200,
    });
  } else {
    let counterAttemps = userBlockStored.attemps + 1;
    let informationUpdate = { attemps: counterAttemps };
    if (counterAttemps >= 5) {
      informationUpdate.attemps = 0;
      informationUpdate["status"] = "BLOCK";
    }
    await UserBlock.findByIdAndUpdate(userBlockStored._id, informationUpdate);
    return res
      .status(200)
      .send({ message: "User or password not correct", code: 404 });
  }
};

/*const sendRecoverPassword = async (req, resp) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.status(400).send({ errors: errors.array() });
  }
  let wasTokenGenerated = false;
  let { email } = req.body;
  let language = "en";
  let subject =
    language === "en" ? "Password Recovery" : "Recuperación de contraseña";

  let user = await User.findOne({ email });
  if (!user)
    return resp.status(200).send({ message: "Email sended", code: 200 });
  let name = `${user.firstname} ${user.lastname}`;
  let token = await jwt.sign(
    { id: user._id, name: user.firstname, lastname: user.lastname },
    JWTConfig.secret,
    { expiresIn: "1h" }
  );
  let tokenStored = await RecoveryToken.findOne({ userId: user._id });

  if (!tokenStored) {
    let newTokenStored = new RecoveryToken({
      token,
      userId: user._id,
    });
    let tokenSaved = await newTokenStored.save();
    if (tokenSaved) wasTokenGenerated = true;
  } else if (tokenStored && tokenStored.status === "INVALID") {
    let tokenSaved = await RecoveryToken.findByIdAndUpdate(tokenStored._id, {
      token,
      status: "VALID",
    });
    if (tokenSaved) wasTokenGenerated = true;
  } else {
    token = tokenStored.token;
    wasTokenGenerated = true;
  }

  if (wasTokenGenerated) {
    const url = `${req.protocol}://${req.get("host")}`;
    sendMailService(
      {
        subject,
        email,
        url,
        name,
        token,
      },
      language,
      "password",
      (err, resultado) => {
        if (err) {
          return resp.status(500).send({ err });
        }
        return resp
          .status(200)
          .send({ message: "Email send successfully", code: 200 });
      }
    );
  } else
    return resp.status(401).send({ message: "Error when generated token" });
};*/

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  let { first_name, last_name, password, email, area, cargo } = req.body;

  const hashPassword = await bcrypt.hash(password, salt);
  try {
    let user = new User({
      firstname: first_name,
      lastname: last_name,
      password: hashPassword,
      email,
      area,
      cargo,
    });
    let userStored = await user.save();
    if (userStored)
      return res.status(200).send({ message: "Usuario creado", code: 200 });
    else
      return res.status(200).send({
        message: "Error when try register, please try later",
        code: 500,
      });
  } catch (e) {
    return res.status(200).send({ message: "Email duplicated", code: 403 });
  }
};

const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  let { first_name, last_name, email, area, cargo } = req.body;
  try {
    let user = {};

    if (first_name) user.firstname = first_name;
    if (last_name) user.lastname = last_name;
    if (email) user.email = email;
    if (area) user.area = area;
    if (cargo) user.area = cargo;

    let userStored = await User.findByIdAndUpdate(req.user.id, user);
    if (userStored)
      return res
        .status(200)
        .send({ message: "Usuario Actualizado", code: 200 });
    else
      return res.status(200).send({
        message: "Error when try update, please try later",
        code: 500,
      });
  } catch (e) {
    return res.status(200).send({ message: "Email duplicated", code: 403 });
  }
};

/*const verifyTokenForUpdate = async (req, resp) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  let { token } = req.body;
  let tokenStored = await RecoveryToken.findOne({ token, status: "VALID" });
  if (!tokenStored)
    return resp
      .status(404)
      .send({ message: "Error, token invalid", code: 404 });
  try {
    let payload = jwt.verify(tokenStored.token, JWTConfig.secret);
    if (payload) {
      return resp.status(200).send({ message: "Correct", code: 200 });
    } else
      return resp
        .status(401)
        .send({ message: "Error, token invalid", code: 401 });
  } catch (e) {
    await RecoveryToken.findByIdAndUpdate(tokenStored._id, {
      status: "INVALID",
    });
    return resp.status(403).send({
      message: "You don't have permission for this screen",
      code: 403,
    });
  }
};*/

/*const updatePassword = async (req, resp) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.status(400).send({ errors: errors.array() });
  }

  let { password } = req.body;

  const hashPassword = await bcrypt.hash(password, salt);
  let user = await User.findByIdAndUpdate(req.user.id, {
    password: hashPassword,
  });
  if (user) {
    await RecoveryToken.findByIdAndDelete(req.user.tokenId);
    return resp
      .status(200)
      .send({ message: "Password user Updated", code: 200 });
  } else
    return resp
      .status(500)
      .send({ message: "password cannot change", code: 500 });
};*/

module.exports = {
  login,
  createUser,
  updateUser,
};
