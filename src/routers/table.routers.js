const express = require("express");
const { Service } = require("../models");
const { checkCreateService } = require("../middlewares/validation/checkCreate");
const { authenticate } = require("../middlewares/auth/authenticate.js");
const { authorize } = require("../middlewares/auth/authorize.js");
const {
  getAllTableByDate,
  checkAvailableTable,
} = require("../controllers/table.controllers");
const tableRouter = express.Router();

tableRouter.get("/get", getAllTableByDate);

tableRouter.get("/check/available", checkAvailableTable);

module.exports = {
  tableRouter,
};
