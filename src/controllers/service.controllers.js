const { Service } = require("../models");
const { ERROR_SERVER } = require("../config/messages/success.message");

const getAllServiceFilter = async (req, res) => {
  try {
    const limit = req.query.limit;
    const page = req.query.page;
    const order = req.query.order; //order: thứ tự price
    const count = [limit * (page - 1), limit * page];
    let result = await Service.findAndCountAll({
      offset: count[0],
      limit: count[1] - count[0],
      order: [["price", order]],
    });
    let maxPage = Math.ceil(result.count / limit);
    result.rows.forEach((element) => {
      element.dataValues.priceStr = element.dataValues.price.toLocaleString();
      delete element.dataValues.DishType;
    });

    res.status(200).json({
      isSuccess: true,
      data: {
        total: result.count,
        currentPage: page,
        maxPage,
        rows: result.rows,
      },
    });
  } catch (error) {
    res.status(500).json({ isSuccess: false, msg: ERROR_SERVER });
  }
};

module.exports = {
  getAllServiceFilter,
};
