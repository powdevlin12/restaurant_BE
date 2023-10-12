const { ERROR_CREATE, ERROR_SERVER } = require("../config/messages/error.message");
const { SUCCESS_CREATE } = require("../config/messages/success.message");
const { Message, Conversation, User, UserConversation } = require("../models");

const createMessageService = async (userId, content, conversationId) => {
  try {
    const message = await Message.create({
      content,
      userId,
      conversationId,
    });

    if (message) {
      return {
        isSuccess: true,
        message: SUCCESS_CREATE,
        statusCode: 201,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
      message: ERROR_CREATE,
      statusCode: 500,
    };
  }
};

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
    console.log(
      "🚀 ~ file: message.service.js:26 ~ getAllMessagesOfConversationService ~ error:",
      error
    );
    return {
      isSuccess: false,
      message: ERROR_SERVER,
      statusCode: 500,
    };
  }
};

module.exports = {
  createMessageService,
  getAllMessagesOfConversationService,
};
