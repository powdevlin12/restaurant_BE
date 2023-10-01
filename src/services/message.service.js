const { Message } = require("../models");

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
        message: "Tạo tin nhắn thành công"
      }
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createMessageService
}