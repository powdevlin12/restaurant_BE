const jwt = require("jsonwebtoken");
const { Account, Role, User } = require("../../models");
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.access_token;

    if (!token) {
      return res
        .status(400)
        .json({ msg: "Vui lòng đăng nhập!", isSuccess: false });
    }

    const data = jwt.verify(token, "hehehe");
    const account = await Account.findOne({
      where: { phone: data.phone },
    });
    if (account.verified === false) {
      return res
        .status(403)
        .json({ msg: "Tài khoản chưa được xác thực!", isSuccess: false });
    }

    const user = await User.findOne({
      where: {
        accountId: account.accountId,
      }
    })

    req.account = account;
    req.user = user;

    return next();
  } catch {
    return res
      .status(403)
      .json({ msg: "Vui lòng đăng nhập!", isSuccess: false });
  }
};

module.exports = {
  authenticate,
};
