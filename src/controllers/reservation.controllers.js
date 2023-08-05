const {
  Reservation,
  Menu_Reservation,
  User,
  Table,
  Table_Reservation,
  Dish,
  Service,
  Service_Reservation,
} = require("../models");
const db = require("../models/index");

const makeServiceOfReservation = async (
  reservationId,
  services,
  transaction
) => {
  let isSuccess3 = true;
  msgMakeService = "";
  try {
    services = services.split(",").map(Number);
    for (let serviceId of services) {
      let service = await Service.findOne({
        where: {
          serviceId: serviceId,
        },
      });
      const serviceReservation = await Service_Reservation.create(
        {
          reservationId: reservationId,
          serviceId: service.serviceId,
        },
        { transaction: transaction }
      );
    }
  } catch (error) {
    isSuccess3 = false;
    msgMakeService = "Lỗi tạo service";
  }
  return {
    isSuccess3,
    msgMakeService,
  };
};

const makeMenuOfReservation = async (reservationId, dishes, transaction) => {
  let isSuccess2 = true;
  let msgMakeMenu = "";
  try {
    dishes = dishes.split(",").map(Number);

    for (let dishId of dishes) {
      let dish = await Dish.findOne({
        where: {
          dishId: dishId,
        },
      });
      const menuReservation = await Menu_Reservation.create(
        {
          reservationId: reservationId,
          dishId: dish.dishId,
          order: dishes.indexOf(dishId) + 1,
          price: dish.price,
        },
        { transaction: transaction }
      );
    }
  } catch (error) {
    isSuccess2 = false;
    msgMakeMenu = "Lỗi tạo menu";
  }
  return {
    isSuccess2,
    msgMakeMenu,
  };
};

const makeTableOfReservation = async (reservationId, tables, transaction) => {
  let isSuccess = true;
  let msgFillTable = "";
  try {
    tables = tables.split(",").map(Number);

    for (let tableId of tables) {
      let table = await Table.findOne({
        where: {
          tableId: tableId,
        },
      });
      const tableReservation = await Table_Reservation.create(
        {
          reservationId: reservationId,
          tableId: table.tableId,
        },
        { transaction: transaction }
      );
    }
  } catch (error) {
    isSuccess = false;
    msgFillTable = "Thất bại đặt bàn!";
  }
  return {
    isSuccess,
    msgFillTable,
  };
};

const createReservation = async (req, res) => {
  let msgReservation = "";
  try {
    const { dishes, services, note, schedule, tables, preFee, count } =
      req.body;
    let now = new Date(Date.now());
    const account = req.account;
    const user = await User.findOne({
      where: {
        accountId: account.accountId,
      },
      attributes: ["userId"],
    });
    const transaction = await db.sequelize.transaction(); // Bắt đầu transaction
    try {
      const reservation = await Reservation.create(
        {
          userId: user.userId,
          schedule: schedule,
          count: count,
          note: note,
          status: 0,
          preFee: preFee,
          createAt: now,
        },
        { transaction: transaction }
      );
      //fill table
      let { isSuccess, msgFillTable } = await makeTableOfReservation(
        reservation.dataValues.reservationId,
        tables,
        transaction
      );
      //   console.log(isSuccess, msgFillTable);
      if (!isSuccess) {
        msgReservation = msgFillTable;
        throw new Error();
      }
      //make menu
      let { isSuccess2, msgMakeMenu } = await makeMenuOfReservation(
        reservation.dataValues.reservationId,
        dishes,
        transaction
      );
      //   console.log(isSuccess2, msgMakeMenu);
      if (!isSuccess2) {
        msgReservation = msgMakeMenu;
        throw new Error();
      }
      if (services) {
        let { isSuccess3, msgMakeService } = await makeServiceOfReservation(
          reservation.dataValues.reservationId,
          services,
          transaction
        );
        // console.log(isSuccess3, msgMakeService);
        if (!isSuccess3) {
          msgReservation = msgMakeService;
          throw new Error();
        }
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        isSuccess: false,
        msg: "Đặt bàn thất bại: " + msgReservation,
      });
    }
    res.status(200).json({
      isSuccess: true,
      msg: "Đặt bàn thành công",
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Đặt bàn thất bại: " + msgReservation,
    });
  }
};

const getAllReservationFilterByUser = async (req, res) => {
  try {
    const account = req.account;
    const user = await User.findOne({
      where: {
        accountId: account.accountId,
      },
      attributes: ["userId"],
    });
    const type = req.query.type; //type filer: lọc theo status của reservation, ko có => all
    const limit = req.query.limit;
    const page = req.query.page;
    const order = req.query.order; //order: thứ tự ngày tạo đơn đặt bàn
    const count = [limit * (page - 1), limit * page];
    let result; 

    if (!type) {
      result = await Reservation.findAndCountAll({
        where: {
          userId: user.userId,
        },
        offset: count[0],
        limit: count[1] - count[0],
        order: [["createAt", order]],
        attributes: ["reservationId", "schedule", "status", "count"],
      });
    } else {
      result = await Reservation.findAndCountAll({
        where: {
          status: type,
          userId: user.userId,
        },
        offset: count[0],
        limit: count[1] - count[0],
        order: [["createAt", order]],
        attributes: ["reservationId", "schedule", "status"],
      });
    }

    let maxPage = Math.ceil(result.count / limit);

    res.status(200).json({
      result,
      isSuccess: true,
      maxPage,
    });
  } catch (error) {
    res.status(500).json({ isSuccess: false });
  }
};

const getDetailReservation = async (req, res) => {
  try {
    
  } catch (error) {
    res.status(500).json({ isSuccess: false, msg: "Lỗi khi lấy thông tin đặt bàn!" });
  }
}

module.exports = {
  createReservation,
  getAllReservationFilterByUser,
};
