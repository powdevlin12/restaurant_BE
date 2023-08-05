const express = require("express");
// const {  Menu } = require("../models");
// const {
//   checkCreateMenuFromManager,
// } = require("../middlewares/validation/checkCreate");
const { authenticate } = require("../middlewares/auth/authenticate.js");
const { authorize } = require("../middlewares/auth/authorize.js");
const {
  createReservation,
  getAllReservationFilterByUser,
} = require("../controllers/reservation.controllers");
const reservationRouter = express.Router();

reservationRouter.post("/create", authenticate, createReservation);

reservationRouter.get("/get/all", authenticate, getAllReservationFilterByUser);

module.exports = {
  reservationRouter,
};
