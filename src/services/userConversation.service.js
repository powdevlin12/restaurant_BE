const { UserConversation } = require("../models");

const createUserConversationService = async (conversationId, userId) => {
  try {
    const userConversation = await UserConversation.create({
      conversationId,
      userId
    })

    if (userConversation) {
      return {
        isSuccess: true,
        message: 'Tạo UserConversation thành công !'
      }
    }
  } catch (error) {
    console.log("🚀 ~ file: userConversation.service.js:5 ~ createUserConversationService ~ error:", error)
    return {
      isSuccess: false,
      message: 'Tạo UserConversation thất bại !'
    }
  }
}

module.exports = {
  createUserConversationService
}