const { Dish, DishType } = require("../models");

const getAllDishFilter = async (req, res) => {
  try {
    const type = req.query.type; //type filer: lọc theo typeDish của dish, ko có => all
    const limit = req.query.limit;
    const page = req.query.page;
    const order = req.query.order; //order: thứ tự price
    const isDrink = req.query.isDrink;
    const count = [limit * (page - 1), limit * page];
    let result;

    if (!type) {
      result = await Dish.findAndCountAll({
        where: {
          isDrink: isDrink,
        },
        offset: count[0],
        limit: count[1] - count[0],
        order: [["price", order]],
        include: [{ model: DishType }],
      });
    } else {
      result = await Dish.findAndCountAll({
        where: {
          dishTypeId: type,
          isDrink: isDrink,
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
    res.status(500).json({ isSuccess: false });
  }
};

const getAllDishType = async (req, res) => {
  try {
    let isDrinkType = req.query.isDrinkType;
    let dishTypes = await DishType.findAll({
      where: {
        isDrinkType: isDrinkType,
      },
    });
    res.status(200).json({
      isSuccess: true,
      data: {
        dishTypes,
      },
    });
  } catch (error) {
    res.status(500).json({ isSuccess: false });
  }
};

module.exports = {
  getAllDishFilter,
  getAllDishType,
};
