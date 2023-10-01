const { createConversationService } = require("../services/conversation.service");
const { createMessageService } = require("../services/message.service");
const { createUserConversationService } = require("../services/userConversation.service");

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

}

module.exports = {
  createConversation,
  getConversation
}