const { Account, User } = require("../../models");
const { Op } = require("sequelize");

const checkExistAccount = () => {
  return async (req, res, next) => {
    try {
      const { login } = req.body;
      console.log(login);
      if (!login) {
        return res
          .status(400)
          .json({ isSuccess: false, mes: "Thiếu trường input" });
      }

      const account = await Account.findOne({
        where: {
          [Op.or]: [{ phone: login }, { email: login }],
        },
      });

      if (!account) {
        return res
          .status(404)
          .send({ isSuccess: false, mes: "Tài khoản không tồn tại" });
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
        mes: "Có lỗi trong quá trình kiểm tra trùng tài khoản",
      });
    }
  };
};

const checkNotExistAccount = () => {
  return async (req, res, next) => {
    try {
      console.log(1);
      //const staff = req.staff
      const { login } = req.body;

      if (login === "") {
        return res
          .status(400)
          .json({ isSuccess: false, mes: "checkNotExistAcc1" });
      }
      if (isNaN(login)) {
        return res
          .status(400)
          .json({ isSuccess: false, mes: "checkNotExistAcc2" });
      }

      const account = await Account.findOne({
        where: {
          [Op.or]: [{ phone: login }, { email: login }],
        },
      });

      if (account) {
        return res
          .status(409)
          .send({ isSuccess: false, mes: "Tài khoản đã tồn tại" });
      } else {
        next();
      }
    } catch (error) {
      return res.status(500).send({
        isSuccess: false,
        mes: "Có lỗi trong quá trình tạo tài khoản",
      });
    }
  };
};

module.exports = {
  checkExistAccount,
  checkNotExistAccount,
};
