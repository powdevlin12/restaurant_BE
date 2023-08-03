const { Service } = require("../models");

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
    if (name && name.trim() !== "") {
      service.name = name;
    }
    if (price && price.trim() !== "") {
      service.price = price;
    }
    if (image && image.trim() !== "") {
      service.image = image;
    }
    if (unit && unit.trim() !== "") {
      service.unit = unit;
    }

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

module.exports = {
  createService,
  updateService,
};
