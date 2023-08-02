const { Account, User } = require("../../models");

const checkExistAccount = () => {
  return async (req, res, next) => {
    try {
      const { phone } = req.body;
      console.log(phone);
      if (phone === "") {
        return res
          .status(400)
          .json({ isSuccess: false, mes: "checkExistAccount1" });
      }
      if (isNaN(phone)) {
        return res
          .status(400)
          .json({ isSuccess: false, mes: "checkExistAccount2" });
      }
      const account = await Account.findOne({
        where: {
          phone: phone,
        },
      });
      if (!account) {
        return res
          .status(404)
          .send({ isSuccess: false, mes: "Tài khoản không tồn tại" });
      } else {
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
      const { phone } = req.body;

      if (phone === "") {
        return res
          .status(400)
          .json({ isSuccess: false, mes: "checkNotExistAcc1" });
      }
      if (isNaN(phone)) {
        return res
          .status(400)
          .json({ isSuccess: false, mes: "checkNotExistAcc2" });
      }

      const account = await Account.findOne({
        where: {
          phone,
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
