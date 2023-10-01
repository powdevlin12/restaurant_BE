const express = require("express");
const { createConversation, getConversation } = require("../controllers/conversation.controller");
const { authenticate } = require("../middlewares/auth/authenticate");
const { authorize } = require("../middlewares/auth/authorize");
const conversationRouter = express.Router();

conversationRouter
  .post('/', authenticate, createConversation)
  .get('/', authenticate, getConversation)

module.exports = {
  conversationRouter,
};
