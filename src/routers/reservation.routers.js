const express = require("express");
const { authenticate } = require("../middlewares/auth/authenticate.js");
const { authorize } = require("../middlewares/auth/authorize.js");
const {
  createReservation,
  getAllReservationFilterByUser,
  getDetailReservation,
} = require("../controllers/reservation.controllers");
const reservationRouter = express.Router();

reservationRouter.post("/create", authenticate, createReservation);

reservationRouter.get("/get/all", authenticate, getAllReservationFilterByUser);
reservationRouter.get("/get/detail/:reservationId", authenticate, getDetailReservation);

module.exports = {
  reservationRouter,
};
