const { createConversationService, acceptConversationServer } = require("../services/conversation.service");
const { createMessageService } = require("../services/message.service");
const { createUserConversationService, getConversationOfManager, getConversationOfClient } = require("../services/userConversation.service");

const createConversation = async (req, res, next) => {
  const user = req.user;
  const { content } = req.body;
  try {
    const conversationResult = await createConversationService();
    let messageResult = null;
    let userConversation = null;

    if (conversationResult.isSuccess) {
      messageResult = await createMessageService(user.userId, content, conversationResult.conversation.conversationId);

      if (messageResult.isSuccess) {
        userConversation = await createUserConversationService(conversationResult.conversation.conversationId, user.userId);
      }
    }

    if (userConversation.isSuccess) {
      return res.status(200).json({
        isSuccess: true,
        message: 'Bắt đầu nhắn tin thành công !'
      })
    }
  } catch (error) {
    console.log("🚀 ~ file: conversation.controller.js:28 ~ createConversation ~ error:", error)
  }
}

const getConversation = async (req, res, next) => {
  const user = req.user;
  const account = req.account;

  try {
    let conversationsOfManager = null;
    let conversationsOfClient = null;

    if (account.roleId === 2) {
      conversationsOfManager = await getConversationOfManager(user.userId)
    } else {
      conversationsOfClient = await getConversationOfClient(user.userId)
    }
    return res.status(201).json({
      isSuccess: true,
      conversations: account.roleId === 2 ? conversationsOfManager : conversationsOfClient
    })
  } catch (error) {
    console.log("🚀 ~ file: conversation.controller.js:39 ~ getConversation ~ error:", error)
    return res.status(500).json({
      isSuccess: false,
      message: error.message
    })
  }
}

const acceptConversation = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  const result = await acceptConversationServer(id, user.userId);

  if (result.isSuccess) {
    return res.status(201).json({
      isSuccess: true,
      message: result.message
    })
  } else {
    return res.status(500).json({
      isSuccess: false,
      message: 'Manager chấp nhận tin nhắn từ khách hàng thất bại !'
    })
  }
}

module.exports = {
  createConversation,
  getConversation,
  acceptConversation
}