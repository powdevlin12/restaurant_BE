const { Dish } = require("../models");

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

module.exports = {
  createDish,
  updateDish,
};
