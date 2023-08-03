const express = require("express");
const {  Menu } = require("../models");
const {
  checkCreateMenuFromManager,
} = require("../middlewares/validation/checkCreate");
const { authenticate } = require("../middlewares/auth/authenticate.js");
const { authorize } = require("../middlewares/auth/authorize.js");
const {
  createMenuFromManager,
  updateMenuFromManager,
  getMenuByDate,
} = require("../controllers/menu.controllers");
const menuRouter = express.Router();

menuRouter.post(
  "/manager/create/:date",
  authenticate,
  authorize(["manager"]),
  checkCreateMenuFromManager(Menu),
  createMenuFromManager
);

menuRouter.put(
  "/manager/update/:date",
  authenticate,
  authorize(["manager"]),
  updateMenuFromManager
);

menuRouter.get("/:date", authenticate, getMenuByDate);

module.exports = {
    menuRouter,
};
