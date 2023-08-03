const express = require("express");
const { Service } = require("../models");
const { checkCreateService } = require("../middlewares/validation/checkCreate");
const { authenticate } = require("../middlewares/auth/authenticate.js");
const { authorize } = require("../middlewares/auth/authorize.js");
const {
  createService,
  updateService,
} = require("../controllers/service.controllers");
const serviceRouter = express.Router();

serviceRouter.post(
  "/create",
  authenticate,
  authorize(["manager"]),
  checkCreateService(Service),
  createService
);

serviceRouter.put(
  "/update/:serviceId",
  authenticate,
  authorize(["manager"]),
  updateService
);

module.exports = {
  serviceRouter,
};
