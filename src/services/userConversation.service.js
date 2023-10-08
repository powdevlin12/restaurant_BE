const { UserConversation, Conversation, User } = require("../models");
const { Op } = require('sequelize');

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

const getConversationOfManager = async (userId) => {
  try {
    const conversations = await UserConversation.findAll({
      where: {
        [Op.or]: [
          { userId },
          {
            '$Conversation.accept_manager$': 0
          }
        ]
      },
      include: [{
        model: Conversation,
        as: 'Conversation',
        required: true
      },
        User
      ]
    })
    return conversations
  } catch (error) {
    console.log("🚀 ~ file: userConversation.service.js:29 ~ getConversationOfManager ~ error:", error)
    return {
      isSuccess: false,
      message: error.message
    }
  }
}

const getConversationOfClient = async (userId) => {
  try {
    const conversations = await UserConversation.findAll({
      where: {
        userId
      },
      include: [
        Conversation,
        User
      ]
    })
    return conversations
  } catch (error) {
    console.log("🚀 ~ file: userConversation.service.js:58 ~ getConversationOfClient ~ error:", error)
    return {
      isSuccess: false,
      message: error.message
    }
  }
}

module.exports = {
  createUserConversationService,
  getConversationOfManager,
  getConversationOfClient
}