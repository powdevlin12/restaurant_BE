const { createMessageService } = require("../services/message.service");

const createMessage = async (req, res, next) => {
  const user = req.user;
  const { conversationId, content } = req.body;

  const result = await createMessageService(
    user.userId,
    content,
    conversationId
  );

  return res.status(result.statusCode).json({
    isSuccess: result.isSuccess,
    message: result.message,
  });
};

module.exports = {
  createMessage,
};
