const { Dish, DishType } = require("../models");

const getAllDishFilter = async (req, res) => {
  try {
    const type = req.query.type; //type filer: lọc theo typeDish của dish, ko có => all
    const limit = req.query.limit;
    const page = req.query.page;
    const order = req.query.order; //order: thứ tự price
    const count = [limit * (page - 1), limit * page];
    let result;

    if (!type) {
      result = await Dish.findAndCountAll({
        offset: count[0],
        limit: count[1] - count[0],
        order: [["price", order]],
        include: [{ model: DishType }],
      });
    } else {
      result = await Dish.findAndCountAll({
        where: {
          dishTypeId: type,
        },
        offset: count[0],
        limit: count[1] - count[0],
        order: [["price", order]],
        include: [{ model: DishType }],
      });
    }

    let maxPage = Math.ceil(result.count / limit);
    result.rows.forEach((element) => {
      element.dataValues.dishType = element.dataValues.DishType.type;
      delete element.dataValues.DishType;
    });

    res.status(200).json({
      result,
      isSuccess: true,
      maxPage,
    });
  } catch (error) {
    res.status(500).json({ isSuccess: false });
  }
};

module.exports = {
  getAllDishFilter,
};
