const { Reservation, Dish, Service } = require("../models");

const createDish = async (req, res) => {
  try {
    const { name, description, price, image, dishTypeId, isDrink, unit } = req.body;
    const newDish = await Dish.create({
      name: name,
      description: description,
      price: price,
      image: image,
      dishTypeId: dishTypeId,
      isDrink: isDrink,
      unit: unit,
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
    const { name, description, price, image, dishTypeId, isDel, isDrink, unit } =
      req.body;
    const dish = await Dish.findOne({
      where: {
        dishId: dishId,
      },
    });

    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image = image;
    dish.dishTypeId = dishTypeId;
    dish.isDel = isDel;
    dish.isDrink = isDrink;
    dish.unit = unit;
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

const createService = async (req, res) => {
  try {
    const { name, price, image, unit } = req.body;
    const newService = await Service.create({
      name: name,
      price: price,
      image: image,
      unit: unit,
    });
    res.status(200).json({
      isSuccess: true,
      msg: "Tạo dịch vụ thành công",
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Tạo dịch vụ thất bại",
    });
  }
};

const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { name, price, image, unit } = req.body;
    const service = await Service.findOne({
      where: {
        serviceId: serviceId,
      },
    });
    service.name = name;
    service.price = price;
    service.image = image;
    service.unit = unit;

    await service.save();
    res.status(200).json({
      isSuccess: true,
      msg: "Cập nhật dịch vụ thành công",
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Cập nhật dịch vụ thất bại",
    });
  }
};

const getAllReservationFilterByManager = async (req, res) => {
  try {
    const type = req.query.type; //type filer: lọc theo status của reservation, ko có => all
    const limit = req.query.limit;
    const page = req.query.page;
    const order = req.query.order; //order: thứ tự ngày tạo đơn đặt bàn
    const count = [limit * (page - 1), limit * page];
    let result;

    if (!type) {
      result = await Reservation.findAndCountAll({
        offset: count[0],
        limit: count[1] - count[0],
        order: [["createAt", order]],
      });
    } else {
      result = await Reservation.findAndCountAll({
        where: {
          status: type,
        },
        offset: count[0],
        limit: count[1] - count[0],
        order: [["createAt", order]],
      });
    }

    let maxPage = Math.ceil(result.count / limit);
    res.status(200).json({
      result,
      isSuccess: true,
      maxPage,
    });
  } catch (error) {
    res.status(500).json({ isSuccess: false, msg: "Lỗi khi lấy ds đặt bàn" });
  }
};

const updateStatusOfReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { status, managerNote } = req.body;
    const reservation = await Reservation.findOne({
      where: {
        reservationId: reservationId,
      },
    });

    reservation.status = status;
    if (status === "-1") { //nếu từ chối thì thêm lí do
      reservation.managerNote = managerNote;
    }
    await reservation.save();
    res.status(200).json({
      isSuccess: true,
      msg: "Cập nhật trạng thái đặt bàn thành công",
    });
  } catch (error) {
    res
      .status(500)
      .json({ isSuccess: false, msg: "Lỗi khi cập nhật trạng thái" });
  }
};

module.exports = {
  createDish,
  updateDish,
  createService,
  updateService,
  getAllReservationFilterByManager,
  updateStatusOfReservation,
};
