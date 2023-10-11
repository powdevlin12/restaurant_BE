const { Message, Conversation, User, UserConversation } = require("../models");

const createMessageService = async (userId, content, conversationId) => {
  try {
    const message = await Message.create({
      content,
      userId,
      conversationId
    })

    if (message) {
      return {
        isSuccess: true,
        message: "Tạo tin nhắn thành công",
        statusCode: 201,
      }
    }
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
      message: "Tạo tin nhắn thất bại, lỗi server",
      statusCode: 500,
    }
  }
}

const getAllMessagesOfConversationService = async (conversationId, roleId) => {
  console.log("🚀 ~ file: message.service.js:29 ~ getAllMessagesOfConversationService ~ roleId:", roleId)
  try {
    if (roleId !== 3) {
      const allMessage = await Message.findAll({
        where: {
          conversationId
        },
        include: [
          User,
          Conversation
        ]
      });

      return {
        allMessage,
        statusCode: 200,
        isSuccess: true,
      }
    } else {
      const userConversation = await UserConversation.findOne({
        where: {
          conversationId
        }
      })

      const allMessage = await Message.findAll({
        where: {
          conversationId: userConversation.conversationId
        },
        include: [
          User
        ]
      })
      return {
        statusCode: 200,
        isSuccess: true,
        allMessage
      }
    }
  } catch (error) {
    console.log("🚀 ~ file: message.service.js:26 ~ getAllMessagesOfConversationService ~ error:", error)
    return {
      isSuccess: false,
      message: 'Tải thất bại lỗi server',
      statusCode: 500,
    }
  }
}

module.exports = {
  createMessageService,
  getAllMessagesOfConversationService
}