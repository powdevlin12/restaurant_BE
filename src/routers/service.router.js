const express = require("express");
const { Service } = require("../models");
const { authenticate } = require("../middlewares/auth/authenticate.js");
const { authorize } = require("../middlewares/auth/authorize.js");
const {} = require("../controllers/service.controllers");
const serviceRouter = express.Router();

module.exports = {
  serviceRouter,
};
