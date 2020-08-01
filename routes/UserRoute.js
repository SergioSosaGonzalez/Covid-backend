"use strict";

const UserController = require("../controllers/UserController");
const express = require("express");
const api = express.Router();
const VerifyUser = require("../middelwares/verifyToken");
const { check, validationResult } = require("express-validator");

api.post(
  "/login",
  [
    check("email", "Email is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is requried").not().isEmpty(),
    check(
      "password",
      "Please enter a password with 5 or more characters"
    ).isLength({ min: 5 }),
  ],
  UserController.login
);
api.post(
  "/register-user",
  [
    check("first_name", "First name is required").not().isEmpty(),
    check("last_name", "First name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is requried").not().isEmpty(),
    check("cargo", "Cargo is required").not().isEmpty(),
    check("area", "Area is required").not().isEmpty(),
    check(
      "password",
      "Please enter a password with 5 or more characters"
    ).isLength({ min: 5 }),
  ],
  UserController.createUser
);
api.put(
  "/update-user",
  [
    VerifyUser.checkTokens,
    check("first_name", "First name is required").not().isEmpty(),
    check("last_name", "First name is required").not().isEmpty(),
    check("cargo", "Cargo is required").not().isEmpty(),
    check("area", "Area is required").not().isEmpty(),
  ],
  UserController.updateUser
);
module.exports = api;
