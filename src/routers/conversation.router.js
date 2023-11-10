const express = require("express");
const { createConversation, getConversation, acceptConversation, getAllMessagesOfConversation, getMembersInConversation, getAllMessagesOfClient } = require("../controllers/conversation.controller");
const { authenticate } = require("../middlewares/auth/authenticate");
const { authorize } = require("../middlewares/auth/authorize");
const conversationRouter = express.Router();

conversationRouter
  .post('/', authenticate, createConversation)
  .get('/', authenticate, getConversation) // get all conversations for user
  .get('/:id', authenticate, getAllMessagesOfConversation) // get conversation by id of manager
  .get('/client/message', authenticate, getAllMessagesOfClient) // get conversation by id of manager
  .get("/:conversationId/members", authenticate, getMembersInConversation)
  .patch('/:id', authenticate, authorize(["manager"]), acceptConversation)

module.exports = {
  conversationRouter,
};
