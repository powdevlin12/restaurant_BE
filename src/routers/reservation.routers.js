const express = require("express");
const { authenticate } = require("../middlewares/auth/authenticate.js");
const { authorize } = require("../middlewares/auth/authorize.js");
const {
  createReservation,
  getAllReservationFilterByUser,
  getDetailReservation,
  cancelReservation,
  ChangeSchedule,
} = require("../controllers/reservation.controllers");
const reservationRouter = express.Router();

reservationRouter.post("/create", authenticate, createReservation)
  .get("/get/all", authenticate, getAllReservationFilterByUser)
  .get("/get/detail/:reservationId", authenticate, getDetailReservation)
  .patch('/cancel', authenticate, cancelReservation)
  .patch('/change-schedule/:reservationId', authenticate, ChangeSchedule)

module.exports = {
  reservationRouter,
};
