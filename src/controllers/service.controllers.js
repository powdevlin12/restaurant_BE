const { Service } = require("../models");

const getAllService = async (req, res) => {
  try {
    const services = await Service.findAll();
    services.forEach((element) => {
      element.dataValues.priceStr = element.dataValues.price.toLocaleString();
    });
    res.status(200).json({
      isSuccess: true,
      data: {
        services,
      },
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Lỗi khi lấy danh sách dịch vụ",
    });
  }
};

module.exports = {
  getAllService,
};
