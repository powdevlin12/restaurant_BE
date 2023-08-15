const express = require("express");
const { authenticate } = require("../middlewares/auth/authenticate.js");
const { authorize } = require("../middlewares/auth/authorize.js");
const {
  getAllDishFilter,
  getAllDishType,
  searchDish,
} = require("../controllers/dish.controllers");
const dishRouter = express.Router();

dishRouter.get("/get", getAllDishFilter);
dishRouter.get("/get/search/", searchDish);

dishRouter.get("/get/type", getAllDishType);

module.exports = {
  dishRouter,
};
