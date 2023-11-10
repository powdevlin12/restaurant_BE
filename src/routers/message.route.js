const express = require("express");
const { authenticate } = require("../middlewares/auth/authenticate");
const { authorize } = require("../middlewares/auth/authorize");
const { createMessage } = require("../controllers/message.controller");
const messageRouter = express.Router();

messageRouter
  .post('/', authenticate, createMessage)

module.exports = {
  messageRouter,
};
