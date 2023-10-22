const { Op } = require("sequelize");
const { ERROR_SERVER } = require("../../config/messages/error.message");

const checkCreateAccount = (Model) => {
  return async (req, res, next) => {
    try {
      const { phone, email } = req.body;
      const account = await Model.findOne({
        where: {
          [Op.or]: [{ phone: phone }, { email: email }],
        },
      });
      if (!account) {
        next();
      } else {
        var msg = "";
        if (account.phone === phone && account.email !== email) {
          msg = "Số điện thoại đã được sử dụng";
        } else if (account.phone !== phone && account.email === email) {
          msg = "Email đã được sử dụng";
        }
        res.status(409).json({
          isSuccess: false,
          msg: msg !== "" ? msg : "Số điện thoại và email đã được sử dụng",
        });
      }
    } catch (error) {
      res.status(500).json({ isSuccess: false, msg: ERROR_SERVER });
    }
  };
};

const checkCreateDish = (Model) => {
  try {
    return async (req, res, next) => {
      const { name, isDrink } = req.body;
      const dish = await Model.findOne({
        where: {
          name,
        },
      });
      if (!dish) {
        next();
      } else {
        res.status(400).json({
          isSuccess: false,
          msg: isDrink ? "Đồ uống đã tồn tại" : "Món đã tồn tại!",
        });
      }
    };
  } catch (error) {
    res.status(501).json({ isSuccess: false, msg: ERROR_SERVER });
  }
};

const checkCreateService = (Model) => {
  try {
    return async (req, res, next) => {
      const { name } = req.body;
      const service = await Model.findOne({
        where: {
          name,
        },
      });
      if (!service) {
        next();
      } else {
        res.status(400).json({
          isSuccess: false,
          msg: "Dịch vụ đã tồn tại!",
        });
      }
    };
  } catch (error) {
    res.status(501).json({ isSuccess: false, msg: ERROR_SERVER });
  }
};

const checkcreateMenuByManager = (Model) => {
  try {
    return async (req, res, next) => {
      const { date } = req.params;
      const menu = await Model.findOne({
        where: {
          date,
        },
      });
      if (!menu) {
        next();
      } else {
        res.status(400).json({
          data: {
            isExist: true,
          },
          msg: "Menu đã tồn tại!",
        });
      }
    };
  } catch (error) {
    res.status(501).json({ isSuccess: false, msg: ERROR_SERVER });
  }
};

module.exports = {
  checkCreateAccount,
  checkCreateDish,
  checkCreateService,
  checkcreateMenuByManager,
};
