const express = require("express");
const { authenticate } = require("../middlewares/auth/authenticate.js");
const { authorize } = require("../middlewares/auth/authorize.js");
const {
  getAllDishFilter,
} = require("../controllers/dish.controllers");
const dishRouter = express.Router();

dishRouter.get("/get",
//  authenticate,
 getAllDishFilter);

module.exports = {
  dishRouter,
};
