const express = require("express");
const { userRouter } = require("./user.routers");
const { accountRouter } = require("./account.routers");
const { dishRouter } = require("./dish.routers");
const { serviceRouter } = require("./service.router");
const { menuRouter } = require("./menu.routers");
const { reservationRouter } = require("./reservation.routers");
const rootRouter = express.Router();

rootRouter.use("/account", accountRouter);
rootRouter.use("/dish", dishRouter);
rootRouter.use("/service", serviceRouter);
rootRouter.use("/menu", menuRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/reservation", reservationRouter);

module.exports = {
  rootRouter,
};
