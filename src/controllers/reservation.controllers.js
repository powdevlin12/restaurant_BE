const {
  Reservation,
  Menu_Reservation,
  User,
  Table,
  Table_Reservation,
  Dish,
  Service,
  Service_Reservation,
  TableType,
} = require("../models");
const db = require("../models/index");
const { Op } = require("sequelize");

const makeServiceOfReservation = async (
  reservationId,
  services,
  transaction
) => {
  let isSuccess3 = true;
  msgMakeService = "";
  let preFeeService = 0;
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
          price: service.price,
        },
        { transaction: transaction }
      );
      preFeeService += serviceReservation.price;
    }
  } catch (error) {
    isSuccess3 = false;
    msgMakeService = "Lỗi tạo service";
  }
  return {
    isSuccess3,
    msgMakeService,
    preFeeService,
  };
};

const makeMenuOfReservation = async (reservationId, dishes, transaction) => {
  let isSuccess2 = true;
  let msgMakeMenu = "";
  let preFeeMenu = 0;
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
      preFeeMenu += menuReservation.price;
    }
  } catch (error) {
    isSuccess2 = false;
    msgMakeMenu = "Lỗi tạo menu";
  }
  return {
    isSuccess2,
    msgMakeMenu,
    preFeeMenu,
  };
};

const makeTableOfReservation = async (
  reservationId,
  tableTypeId,
  schedule,
  countGuest,
  transaction
) => {
  let isSuccess = true;
  let msgFillTable = "";
  let preFeeTable = 0;
  try {
    schedule = new Date(schedule);
    // trên dưới 4h tính từ thời gian truyền vào,
    // những table nào trống => available
    let startSchedule = new Date(schedule.getTime() - 4 * 60 * 60 * 1000);
    let endSchedule = new Date(schedule.getTime() + 4 * 60 * 60 * 1000);
    // console.log("datetime", schedule);
    // console.log("startDateTime:", startSchedule);
    // console.log("endDateTime:", endSchedule);
    let countTable = Math.ceil(countGuest / 4);
    let reservations;
    let tables, tableReservations;
    // Truy vấn tất cả những reservation, và table thỏa điều kiện
    reservations = await Reservation.findAll({
      where: {
        schedule: {
          [Op.between]: [startSchedule, endSchedule], //tìm những reservation mà thời gian diễn ra nằm trong khoảng này
        },
        [Op.not]: [{ status: -1 }],
      },
    });
    tables = await Table.findAll({
      where: {
        tableTypeId: tableTypeId,
      },
      include: [{ model: TableType }],
    });
    //khai báo array chứa reservationIdOfReservations
    let reservationIdOfReservations = [];
    for (let element of reservations) {
      // console.log(reservations.indexOf(reservation), reservation.dataValues);
      //kiểm tra chưa tồn tại trong array thì push reservationId vào
      if (
        !reservationIdOfReservations.includes(element.dataValues.reservationId)
      ) {
        reservationIdOfReservations.push(element.dataValues.reservationId);
      }
    }
    // for (let reservationId of reservationIdOfReservations) {
    //   console.log(
    //     reservationIdOfReservations.indexOf(reservationId),
    //     reservationId
    //   );
    // }
    // for (let table of tables) {
    //   console.log(tables.indexOf(table), table.dataValues);
    // }
    // tìm những Table_Reservation có các reservationId trong array reservationIdOfReservations
    tableReservations = await Table_Reservation.findAll({
      where: {
        reservationId: reservationIdOfReservations,
      },
    });
    let tableIdOfTableReservations = [];
    for (let element of tableReservations) {
      if (!tableIdOfTableReservations.includes(element.dataValues.tableId)) {
        tableIdOfTableReservations.push(element.dataValues.tableId);
      }
    }
    // for (let element of tableIdOfTableReservations) {
    //   console.log(tableIdOfTableReservations.indexOf(element), element);
    // }
    let needTables = [];
    for (let element of tables) {
      if (tableIdOfTableReservations.includes(element.dataValues.tableId)) {
        //nếu element nằm trong những tabledId của tableIdOfTableReservations thì ko push
      } else {
        needTables.push(element);
      }
      if (needTables.length == countTable) {
        break;
      }
    }
    if (needTables.length < countTable) {
      return {
        isSuccess: false,
        msgFillTable: "Không đủ bàn! Hãy thử loại bàn khác!",
      };
    }
    for (let element of needTables) {
      let table = await Table.findOne({
        where: {
          tableId: element.tableId,
        },
      });
      const tableReservation = await Table_Reservation.create(
        {
          reservationId: reservationId,
          tableId: table.tableId,
        },
        { transaction: transaction }
      );
      preFeeTable += element.dataValues.TableType.fee;
    }
  } catch (error) {
    isSuccess = false;
    msgFillTable = "Lỗi khi đặt bàn!";
  }
  return {
    isSuccess,
    msgFillTable,
    preFeeTable,
  };
};

const createReservation = async (req, res) => {
  let msgReservation = "";
  let preFee = 0;
  try {
    const { dishes, services, note, schedule, tableTypeId, countGuest } =
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
          countGuest: countGuest,
          note: note,
          status: -2,
          createAt: now,
        },
        { transaction: transaction }
      );
      //check available & fill table
      let { isSuccess, msgFillTable, preFeeTable } =
        await makeTableOfReservation(
          reservation.dataValues.reservationId,
          tableTypeId,
          schedule,
          countGuest,
          transaction
        );
      if (!isSuccess) {
        msgReservation = msgFillTable;
        throw new Error();
      } else {
        preFee += preFeeTable;
      }
      //make menu
      let { isSuccess2, msgMakeMenu, preFeeMenu } = await makeMenuOfReservation(
        reservation.dataValues.reservationId,
        dishes,
        transaction
      );
      if (!isSuccess2) {
        msgReservation = msgMakeMenu;
        throw new Error();
      } else {
        preFee += preFeeMenu;
      }
      if (services) {
        let { isSuccess3, msgMakeService, preFeeService } =
          await makeServiceOfReservation(
            reservation.dataValues.reservationId,
            services,
            transaction
          );
        if (!isSuccess3) {
          msgReservation = msgMakeService;
          throw new Error();
        } else {
          preFee += preFeeService;
        }
      }
      // nếu tổng tiền >= 1000000 thì lấy 30%, ko thì ko tính
      if (preFee >= 1000000) {
        preFee = Math.ceil(preFee * 0.3);
      } else {
        preFee = 0;
      }
      reservation.preFee = preFee;
      await reservation.save({ transaction: transaction });
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
      data: {
        preFee,
      },
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
    const status = req.query.status; //status filer: lọc theo status của reservation, ko có => all
    const limit = req.query.limit;
    const page = req.query.page;
    const order = req.query.order; //order: thứ tự ngày tạo đơn đặt bàn
    const count = [limit * (page - 1), limit * page];
    let result;
    if (account.roleId == 3) {
      //nếu role là client thì chỉ lấy những reservation thuộc user đó
      if (!status) {
        result = await Reservation.findAndCountAll({
          where: {
            userId: user.userId,
          },
          offset: count[0],
          limit: count[1] - count[0],
          order: [["createAt", order]],
          attributes: [
            "reservationId",
            "schedule",
            "status",
            "countGuest",
            "createAt",
          ],
        });
      } else {
        result = await Reservation.findAndCountAll({
          where: {
            status: status,
            userId: user.userId,
          },
          offset: count[0],
          limit: count[1] - count[0],
          order: [["createAt", order]],
          attributes: [
            "reservationId",
            "schedule",
            "status",
            "countGuest",
            "createAt",
          ],
        });
      }
    } else {
      //là manager hoặc admin thì lấy toàn bộ
      if (!status) {
        result = await Reservation.findAndCountAll({
          offset: count[0],
          limit: count[1] - count[0],
          order: [["createAt", order]],
          attributes: [
            "reservationId",
            "schedule",
            "status",
            "countGuest",
            "createAt",
          ],
          include: [{ model: User, attributes: ["userId", "userName"] }],
        });
      } else {
        result = await Reservation.findAndCountAll({
          where: {
            status: status,
          },
          offset: count[0],
          limit: count[1] - count[0],
          order: [["createAt", order]],
          attributes: [
            "reservationId",
            "schedule",
            "status",
            "countGuest",
            "createAt",
          ],
          include: [{ model: User, attributes: ["userId", "userName"] }],
        });
      }
    }

    for (let element of result.rows) {
      element.dataValues.user = element.dataValues.User;
      delete element.dataValues.User;
    }

    let maxPage = Math.ceil(result.count / limit);
    let total = result.count;
    delete result.count;
    let reservations = result.rows;
    res.status(200).json({
      isSuccess: true,
      data: {
        maxPage,
        total: total,
        currentPage: page,
        reservations,
      },
    });
  } catch (error) {
    res.status(500).json({ isSuccess: false, msg: "Thất bại!" });
  }
};

const getDetailReservation = async (req, res) => {
  try {
    let { reservationId } = req.params;
    let reservation = await Reservation.findOne({
      where: {
        reservationId: reservationId,
      },
    });
    reservation.dataValues.preFeeStr =
      reservation.dataValues.preFee.toLocaleString();
    let menuReservation = await Menu_Reservation.findAll({
      where: {
        reservationId: reservation.reservationId,
      },
      attributes: ["dishId", "price", "order"],
      include: [
        {
          model: Dish,
          attributes: ["name", "description", "image", "isDrink", "unit"],
        },
      ],
    });
    reservation.dataValues.menus = menuReservation;
    reservation.dataValues.menus.forEach((element) => {
      element.dataValues.name = element.dataValues.Dish.name;
      element.dataValues.priceStr = element.dataValues.price.toLocaleString();
      element.dataValues.description = element.dataValues.Dish.description;
      element.dataValues.image = element.dataValues.Dish.image;
      element.dataValues.unit = element.dataValues.Dish.unit;
      element.dataValues.isDrink = element.dataValues.Dish.isDrink;
      delete element.dataValues.Dish;
    });
    let tableReservation = await Table_Reservation.findAll({
      where: {
        reservationId: reservation.reservationId,
      },
      attributes: ["tableId"],
      include: [
        {
          model: Table,
          attributes: ["name", "tableTypeId"],
        },
      ],
    });
    reservation.dataValues.tables = tableReservation;
    reservation.dataValues.tables.forEach((element) => {
      element.dataValues.name = element.dataValues.Table.name;
      delete element.dataValues.Table;
    });
    res.status(200).json({
      isSuccess: true,
      data: { reservation: reservation },
    });
  } catch (error) {
    res
      .status(500)
      .json({ isSuccess: false, msg: "Lỗi khi lấy thông tin đặt bàn!" });
  }
};

module.exports = {
  createReservation,
  getAllReservationFilterByUser,
  getDetailReservation,
};
