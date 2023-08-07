const { Account, User, Role } = require("../../models");
const { QueryTypes } = require("sequelize");

const authorize = (role) => async (req, res, next) => {
  try {
    const account = req.account;

    if (role == "manager") {
      if (account.dataValues.roleId === 2) {
        const user = await User.findOne({
          where: { accountId: account.accountId },
        });
        req.user = user;
        next();
      } else {
        return res
          .status(403)
          .json({ msg: "Bạn không có quyền sử dụng chức năng này!" });
      }
    } else {
      if (account.dataValues.role >= role) {
        const staff = await Staff.findOne({
          where: { accountId: account.accountId },
        });
        req.staff = staff;
        next();
      } else {
        return res
          .status(403)
          .json({ msg: "Bạn không có quyền sử dụng chức năng này!" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error, msg: "failed authorize" });
  }
};

module.exports = {
  authorize,
};
