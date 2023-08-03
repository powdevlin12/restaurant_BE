const express = require("express");
const { Dish } = require("../models");
const { checkCreateDish } = require("../middlewares/validation/checkCreate");
const { authenticate } = require("../middlewares/auth/authenticate.js");
const { authorize } = require("../middlewares/auth/authorize.js");
const {
  createDish,
  updateDish,
  getAllDishFilter,
} = require("../controllers/dish.controllers");
const dishRouter = express.Router();

dishRouter.post(
  "/create",
  authenticate,
  authorize(["manager"]),
  checkCreateDish(Dish),
  createDish
);

dishRouter.put(
  "/update/:dishId",
  authenticate,
  authorize(["manager"]),
  // checkCreateDish(Dish),
  updateDish
);

dishRouter.get("/get", authenticate, getAllDishFilter);

module.exports = {
  dishRouter,
};
