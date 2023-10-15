const { createConversationService, acceptConversationServer, getMembersInConversationService, getAllMessagesOfClientServer } = require("../services/conversation.service");
const { createMessageService, getAllMessagesOfConversationService } = require("../services/message.service");
const { createUserConversationService, getConversationOfManager, getConversationOfClient } = require("../services/userConversation.service");

const createConversation = async (req, res, next) => {
  const user = req.user;
  const { content } = req.body;
  try {
    const conversationResult = await createConversationService();
    let messageResult = null;
    let userConversation = null;

    if (conversationResult.isSuccess) {
      messageResult = await createMessageService(
        user.userId,
        content,
        conversationResult.conversation.conversationId
      );

      if (messageResult.isSuccess) {
        userConversation = await createUserConversationService(
          conversationResult.conversation.conversationId,
          user.userId
        );
      }
    }

    if (userConversation.isSuccess) {
      return res.status(200).json({
        isSuccess: true,
        message: "Bắt đầu nhắn tin thành công !",
        data: {
          coversationId: conversationResult.conversation.conversationId
        }
      });
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: conversation.controller.js:28 ~ createConversation ~ error:",
      error
    );
  }
};

const getConversation = async (req, res, next) => {
  const user = req.user;
  const account = req.account;

  try {
    let conversationsOfManager = null;
    let conversationsOfClient = null;

    if (account.roleId === 2) {
      conversationsOfManager = await getConversationOfManager(user.userId);
    } else {
      conversationsOfClient = await getConversationOfClient(user.userId);
    }
    return res.status(200).json({
      isSuccess: true,
      data: {
        conversations:
          account.roleId === 2 ? conversationsOfManager : conversationsOfClient,
      },
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: conversation.controller.js:39 ~ getConversation ~ error:",
      error
    );
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

const getMembersInConversation = async (req, res, next) => {
  const { conversationId } = req.params;
  console.log(
    "🚀 ~ file: conversation.controller.js:60 ~ getMembersInConversation ~ conversationId:",
    conversationId
  );
  const result = await getMembersInConversationService(conversationId);

  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(500).json(result);
  }
};

const acceptConversation = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  const result = await acceptConversationServer(id, user.userId);

  if (result.isSuccess) {
    return res.status(201).json({
      isSuccess: true,
      message: result.message,
    });
  } else {
    return res.status(500).json({
      isSuccess: false,
      message: result.message,
    });
  }
};

const getAllMessagesOfConversation = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  const account = req.account;

  const result = await getAllMessagesOfConversationService(id, req.account.roleId);

  if (result.isSuccess) {
    return res.status(result.statusCode).json({
      isSuccess: result.isSuccess,
      data: {
        allMessage: result.allMessage,
      },
      message: result.message,
    });
  } else {
    return res
      .status(result.statusCode)
      .json({ isSuccess: result.isSuccess, message: result.message });
  }
};

const getAllMessagesOfClient = async (req, res, next) => {
  const user = req.user;
  const result = await getAllMessagesOfClientServer(user.userId)

  const { isSuccess, data, message, statusCode } = result

  if (isSuccess) {
    return res.status(200).json({
      isSuccess,
      data
    })
  }

  return res.status(400).json({
    isSuccess,
    message
  })
}

module.exports = {
  createConversation,
  getConversation,
  acceptConversation,
  getAllMessagesOfConversation,
  getMembersInConversation,
  getAllMessagesOfClient
}
