const { Account, User } = require("../../models");
const { Op } = require("sequelize");
const { ERROR_SERVER } = require("../../config/messages/error.message");

const checkExistAccount = () => {
  return async (req, res, next) => {
    try {
      const { login } = req.body;
      console.log(login);
      if (!login) {
        return res
          .status(400)
          .json({ isSuccess: false, msg: "Thiếu trường input" });
      }

      const account = await Account.findOne({
        where: {
          [Op.or]: [{ phone: login }, { email: login }],
        },
      });

      if (!account) {
        return res
          .status(404)
          .send({ isSuccess: false, msg: "Tài khoản không tồn tại" });
      } else {
        if (account.verified === false) {
          return res
            .status(403)
            .json({ msg: "Tài khoản chưa được xác thực!", isSuccess: false });
        }
        next();
      }
    } catch (error) {
      return res.status(500).send({
        isSuccess: false,
        msg: ERROR_SERVER,
      });
    }
  };
};

const checkNotExistAccount = () => {
  return async (req, res, next) => {
    try {
      const { login } = req.body;

      if (login === "") {
        return res
          .status(400)
          .json({ isSuccess: false, msg: "checkNotExistAcc1" });
      }
      if (isNaN(login)) {
        return res
          .status(400)
          .json({ isSuccess: false, msg: "checkNotExistAcc2" });
      }

      const account = await Account.findOne({
        where: {
          [Op.or]: [{ phone: login }, { email: login }],
        },
      });

      if (account) {
        return res
          .status(409)
          .send({ isSuccess: false, msg: "Tài khoản đã tồn tại" });
      } else {
        next();
      }
    } catch (error) {
      return res.status(500).send({
        isSuccess: false,
        msg: ERROR_SERVER,
      });
    }
  };
};

module.exports = {
  checkExistAccount,
  checkNotExistAccount,
};
