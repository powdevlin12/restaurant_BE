const { Op } = require("sequelize");

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
        res.status(409).json({
          data: {
            isExist: true,
          },
          isSuccess: false,
          msg: "Số điện thoại hoặc email đã được sử dụng",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ isExist: false, isSuccess: false, msg: "Lỗi tạo tài khoản" });
    }
  };
};

const checkCreateDish = (Model) => {
  try {
    return async (req, res, next) => {
      const { name } = req.body;
      const dish = await Model.findOne({
        where: {
          name,
        },
      });
      if (!dish) {
        next();
      } else {
        res
          .status(400)
          .json({ data: { isExist: true }, msg: "Món đã tồn tại!" });
      }
    };
  } catch (error) {
    res.status(501).json({ msg: "Error!" });
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
          data: {
            isExist: true,
          },
          msg: "Dịch vụ đã tồn tại!",
        });
      }
    };
  } catch (error) {
    res.status(501).json({ msg: "Error!" });
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
    res.status(501).json({ msg: "Error!" });
  }
};

module.exports = {
  checkCreateAccount,
  checkCreateDish,
  checkCreateService,
  checkcreateMenuByManager,
};
