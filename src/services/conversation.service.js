const { Conversation, UserConversation, User } = require("../models");

const createConversationService = async () => {
  try {
    const conversation = await Conversation.create({});
    if (conversation) {
      return {
        isSuccess: true,
        message: "Tạo cuộc hội thoại thành công !",
        conversation,
      };
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: conversation.service.js:14 ~ createConversationService ~ error:",
      error
    );
    return {
      isSuccess: false,
      message: "Tạo cuộc hội thoại thất bại !",
    };
  }
};

const acceptConversationServer = async (conversationId, managerId) => {
  try {
    const resultUpdate = await Conversation.update(
      { accept_manager: true },
      { where: { conversationId, accept_manager: false } }
    );

    if (resultUpdate > 0) {
      const newUserConversation = await UserConversation.create({
        conversationId,
        userId: managerId,
      });
      if (newUserConversation) {
        return {
          isSuccess: true,
          message: "Chấp nhận cuộc hội thoại thành công",
        };
      }
    } else {
      return {
        isSuccess: false,
        message: "Không tìm thấy đoạn hội thoại này !",
      };
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: conversation.service.js:26 ~ acceptConversationServer ~ error:",
      error
    );
    return {
      isSuccess: false,
      message: error.message,
    };
  }
};

const getMembersInConversationService = async (conversationId) => {
  try {
    const result = await UserConversation.findAll({
      where: {
        conversationId,
      },
      include: [User],
    });

    const members = result.map(({ User }) => User);
    return {
      isSuccess: true,
      data: members,
    };
  } catch (error) {
    console.log(
      "🚀 ~ file: conversation.controller.js:62 ~ getMembersInConversation ~ error:",
      error
    );
    return {
      isSuccess: false,
      message: error.message,
    };
  }
};

module.exports = {
  createConversationService,
  acceptConversationServer,
  getMembersInConversationService,
};
