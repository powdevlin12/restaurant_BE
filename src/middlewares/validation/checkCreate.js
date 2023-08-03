const checkCreateAccount = (Model) => {
  return async (req, res, next) => {
    try {
      const { phone } = req.body;
      const account = await Model.findOne({
        where: {
          phone,
        },
      });
      if (!account) {
        next();
      } else {
        res.status(409).json({ isExist: true, isSuccess: false });
      }
    } catch (error) {
      res.status(500).json({ isExist: false, isSuccess: false });
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
        res.status(400).json({ isExist: true, message: "Món đã tồn tại!" });
      }
    };
  } catch (error) {
    res.status(501).json({ message: "Error!" });
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
        res.status(400).json({ isExist: true, message: "Dịch vụ đã tồn tại!" });
      }
    };
  } catch (error) {
    res.status(501).json({ message: "Error!" });
  }
};

const checkCreateMenuFromManager = (Model) => {
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
        res.status(400).json({ isExist: true, message: "Menu đã tồn tại!" });
      }
    };
  } catch (error) {
    res.status(501).json({ message: "Error!" });
  }
};

module.exports = {
  checkCreateAccount,
  checkCreateDish,
  checkCreateService,
  checkCreateMenuFromManager,
};
