const express = require("express");
// const {  Menu } = require("../models");
// const {
//   checkCreateMenuFromManager,
// } = require("../middlewares/validation/checkCreate");
const { authenticate } = require("../middlewares/auth/authenticate.js");
const { authorize } = require("../middlewares/auth/authorize.js");
const { createReservation } =
  require("../controllers/reservation.controllers");
const reservationRouter = express.Router();

reservationRouter.post(
  "/create",
  authenticate,
  //   authorize(["manager"]),
  //   checkCreateMenuFromManager(Menu),
  createReservation
);

module.exports = {
  reservationRouter,
};
