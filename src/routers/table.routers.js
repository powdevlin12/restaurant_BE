const express = require("express");
const { Service } = require("../models");
const { checkCreateService } = require("../middlewares/validation/checkCreate");
const { authenticate } = require("../middlewares/auth/authenticate.js");
const { authorize } = require("../middlewares/auth/authorize.js");
const { getAllTableByDate } = require("../controllers/table.controllers");
const tableRouter = express.Router();

tableRouter.get(
  "/get",
  // authenticate,
  getAllTableByDate
);

module.exports = {
  tableRouter,
};
