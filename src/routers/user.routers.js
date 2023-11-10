const express = require("express");
const { User, Menu } = require("../models");
// const {
//   checkcreateMenuByManager,
// } = require("../middlewares/validation/checkCreate");
const { authenticate } = require("../middlewares/auth/authenticate.js");
const { authorize } = require("../middlewares/auth/authorize.js");
const {} = require("../controllers/user.controllers");
const userRouter = express.Router();

module.exports = {
  userRouter,
};
