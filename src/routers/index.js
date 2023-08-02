const express = require("express");
// const { userRouter } = require("./user.routers");
const { accountRouter } = require("./account.routers");
const { dishRouter } = require("./dish.routers");

const rootRouter = express.Router();

rootRouter.use("/account", accountRouter);
rootRouter.use("/dish", dishRouter);

module.exports = {
  rootRouter,
};
