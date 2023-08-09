const express = require("express");
const { Menu } = require("../models");
const {
  checkcreateMenuByManager,
} = require("../middlewares/validation/checkCreate");
const { authenticate } = require("../middlewares/auth/authenticate.js");
const { authorize } = require("../middlewares/auth/authorize.js");
const {
  createMenuByManager,
  updateMenuByManager,
  getMenuByDate,
} = require("../controllers/menu.controllers");
const menuRouter = express.Router();

menuRouter.post(
  "/manager/create/:date",
  authenticate,
  authorize(["manager"]),
  checkcreateMenuByManager(Menu),
  createMenuByManager
);

menuRouter.put(
  "/manager/update/:date",
  authenticate,
  authorize(["manager"]),
  updateMenuByManager
);

menuRouter.get(
  "/:date",
  //  authenticate,
  getMenuByDate
);

module.exports = {
  menuRouter,
};
