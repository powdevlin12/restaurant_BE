const { Conversation } = require("../models");

const createConversationService = async () => {
  try {
    const conversation = await Conversation.create({});
    if (conversation) {
      return {
        isSuccess: true,
        message: 'Tạo cuộc hội thoại thành công !',
        conversation
      }
    }
  } catch (error) {
    console.log("🚀 ~ file: conversation.service.js:14 ~ createConversationService ~ error:", error)
    return {
      isSuccess: false,
      message: 'Tạo cuộc hội thoại thất bại !'
    }
  }

}

module.exports = {
  createConversationService
}