const { Menu, Dish } = require("../models");

const createMenuFromManager = async (req, res) => {
  try {
    const { date } = req.params;
    let { menu } = req.body;
    if (menu !== "") {
      menu = menu.split(",").map(Number);
      for (let dishId of menu) {
        const dish = await Dish.findOne({
          where: {
            dishId: dishId,
          },
        });
        newMenu = await Menu.create({
          date: date,
          dishId: dish.dishId,
          price: dish.price,
        });
      }
    }
    res.status(200).json({
      isSuccess: true,
      msg: "Tạo menu thành công",
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Tạo menu thất bại",
    });
  }
};

const updateMenuFromManager = async (req, res) => {
  try {
    const { date } = req.params;
    let { menu } = req.body;

    let menuDB = await Menu.findAll({
      where: {
        date: date,
      },
    });

    if (menuDB) {
      menuDB = await Menu.destroy({
        where: {
          date: date,
        },
      });
    }

    if (menu !== "") {
      menu = menu.split(",").map(Number);
      for (let dishId of menu) {
        const dish = await Dish.findOne({
          where: {
            dishId: dishId,
          },
        });
        newMenu = await Menu.create({
          date: date,
          dishId: dish.dishId,
          price: dish.price,
        });
      }
    }
    res.status(200).json({
      isSuccess: true,
      msg: "Cập nhật menu thành công",
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Cập nhật menu thất bại",
    });
  }
};

const getMenuByDate = async (req, res) => {
  try {
    const { date } = req.params;
    let menu = await Menu.findAll({
      where: {
        date: date,
      },
    });
    res.status(200).json({
      menu,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Hiện menu thất bại",
    });
  }
};

module.exports = {
  createMenuFromManager,
  updateMenuFromManager,
  getMenuByDate,
};
