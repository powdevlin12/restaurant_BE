const express = require("express");
const { Account } = require("../models");
const { checkExistAccount } = require("../middlewares/validation/checkExist");
const { checkCreateAccount } = require("../middlewares/validation/checkCreate");
const { authenticate } = require("../middlewares/auth/authenticate.js");
const accountRouter = express.Router();

const {
  login,
  logout,
  createAccountForClient,
  forgotPassword,
  changePassword,
  accessForgotPassword,
  verify,
} = require("../controllers/account.controllers");

accountRouter.post("/login", checkExistAccount(Account), login);
accountRouter.get("/logout", authenticate, logout);
accountRouter.post(
  "/create",
  checkCreateAccount(Account),
  createAccountForClient
);
accountRouter.post(
  "/forgotpassword",
  checkExistAccount(Account),
  forgotPassword
);
accountRouter.post(
  "/forgotpassword/verify",
  checkExistAccount(Account),
  verify
);
accountRouter.post(
  "/forgotpassword/verify/success",
  checkExistAccount(Account),
  accessForgotPassword
);
accountRouter.put("/changepassword", authenticate, changePassword);

module.exports = {
  accountRouter,
};
