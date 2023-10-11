const { ERROR_SERVER } = require("../config/messages/error.message");
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
      include: [
        Conversation,
        User
      ]
    })


    const listConversationsPromise = conversations.map(item => getUserByConversationIdService(item.conversationId))

    const result = Promise.all(listConversationsPromise)
      .then((values) => {
        console.log("🚀 ~ file: userConversation.service.js:48 ~ .then ~ values:", values)
        const finalData = []
        values.forEach(conversation => {
          conversation.map((item) => finalData.push({ user: item.User, conversation: item.Conversation }))
        });
        return finalData.filter(item => item.user.userId !== userId);
      })
      .catch(err => {
        console.log("🚀 ~ file: userConversation.service.js:29 ~ getConversationOfManager ~ error:", err)
        return {
          isSuccess: false,
          message: err
        }
      });
    return result;
  } catch (error) {
    console.log("🚀 ~ file: userConversation.service.js:29 ~ getConversationOfManager ~ error:", error)
    return {
      isSuccess: false,
      message: ERROR_SERVER
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
      message: ERROR_SERVER
    }
  }
}

const getUserByConversationIdService = (conversationId) => {
  return new Promise((resolve, reject) => {
    const conversations = UserConversation.findAll({
      where: {
        conversationId
      },
      include: [
        User,
        Conversation
      ]
    })

    if (conversations) {
      resolve(conversations)
    } else {
      reject({
        isSuccess: false,
        error: 'Couldn\'t find conversation'
      })
    }
  })
}

module.exports = {
  createUserConversationService,
  getConversationOfManager,
  getConversationOfClient,
  getUserByConversationIdService
}