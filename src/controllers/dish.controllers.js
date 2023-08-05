const { Dish, DishType } = require("../models");

const createDish = async (req, res) => {
  try {
    const { name, description, price, image, dishTypeId } = req.body;
    const newDish = await Dish.create({
      name: name,
      description: description,
      price: price,
      image: image,
      dishTypeId: dishTypeId,
    });
    res.status(200).json({
      isSuccess: true,
      msg: "Tạo món thành công",
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Tạo món thất bại",
    });
  }
};

const updateDish = async (req, res) => {
  try {
    const { dishId } = req.params;
    const { name, description, price, image, dishTypeId } = req.body;
    const dish = await Dish.findOne({
      where: {
        dishId: dishId,
      },
    });

    if (name && name.trim() !== "") {
      dish.name = name;
    }
    if (description && description.trim() !== "") {
      dish.description = description;
    }
    if (price && price.trim() !== "") {
      dish.price = price;
    }
    if (image && image.trim() !== "") {
      dish.image = image;
    }
    if (dishTypeId && dishTypeId.trim() !== "") {
      dish.dishTypeId = dishTypeId;
    }
    await dish.save();
    res.status(200).json({
      isSuccess: true,
      msg: "Cập nhật món thành công",
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Cập nhật món thất bại",
    });
  }
};

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
  createDish,
  updateDish,
  getAllDishFilter,
};
