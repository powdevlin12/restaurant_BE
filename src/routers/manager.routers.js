const express = require("express");
const { Dish, Service } = require("../models");
const {
  checkCreateDish,
  checkCreateService,
} = require("../middlewares/validation/checkCreate");
const { authenticate } = require("../middlewares/auth/authenticate.js");
const { authorize } = require("../middlewares/auth/authorize.js");
const {
  createDish,
  updateDish,
  createService,
  updateService,
  getAllReservationFilterByManager,
  updateStatusOfReservation,
} = require("../controllers/manager.controllers");
const managerRouter = express.Router();

managerRouter.post(
  "/dish/create",
  authenticate,
  authorize(["manager"]),
  checkCreateDish(Dish),
  createDish
);

managerRouter.put(
  "/dish/update/:dishId",
  authenticate,
  authorize(["manager"]),
  updateDish
);

managerRouter.post(
  "/service/create",
  authenticate,
  authorize(["manager"]),
  checkCreateService(Service),
  createService
);

managerRouter.put(
  "/service/update/:serviceId",
  authenticate,
  authorize(["manager"]),
  updateService
);

managerRouter.get(
  "/reservation/get",
  authenticate,
  authorize(["manager"]),
  getAllReservationFilterByManager
);

managerRouter.put(
  "/reservation/update/status/:reservationId",
  authenticate,
  authorize(["manager"]),
  updateStatusOfReservation
);

module.exports = {
  managerRouter,
};
