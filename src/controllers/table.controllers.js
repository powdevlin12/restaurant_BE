const {
  Table,
  Reservation,
  Table_Reservation,
  TableType,
} = require("../models");
const { Op } = require("sequelize");

const getAllTableByDate = async (req, res) => {
  try {
    let { datetime, tableTypeId } = req.query;
    let reservations;
    let tables, tableReservations;
    datetime = new Date(datetime);
    // trên dưới 4h tính từ thời gian truyền vào,
    // những table nào trống => available
    let startDateTime = new Date(datetime.getTime() - 4 * 60 * 60 * 1000);
    let endDateTime = new Date(datetime.getTime() + 4 * 60 * 60 * 1000);
    console.log("datetime", datetime);
    console.log("startDateTime:", startDateTime);
    console.log("endDateTime:", endDateTime);
    // Truy vấn tất cả những reservation, và table thỏa điều kiện
    if (!tableTypeId) {
      reservations = await Reservation.findAll({
        where: {
          schedule: {
            [Op.between]: [startDateTime, endDateTime], //tìm những reservation mà thời gian diễn ra nằm trong khoảng này
          },
          [Op.not]: [{ status: -1 }],
        },
      });
      tables = await Table.findAll();
    } else {
      reservations = await Reservation.findAll({
        where: {
          schedule: {
            [Op.between]: [startDateTime, endDateTime], //tìm những reservation mà thời gian diễn ra nằm trong khoảng này
          },
          [Op.not]: [{ status: -1 }],
        },
      });
      tables = await Table.findAll({
        where: {
          tableTypeId: tableTypeId,
        },
      });
    }
    //khai báo array chưa reservationIdOfReservations
    let reservationIdOfReservations = [];
    for (let reservation of reservations) {
      // console.log(reservations.indexOf(reservation), reservation.dataValues);
      //kiểm tra chưa tồn tại trong array thì push reservationId vào
      if (
        !reservationIdOfReservations.includes(
          reservation.dataValues.reservationId
        )
      ) {
        reservationIdOfReservations.push(reservation.dataValues.reservationId);
      }
    }
    // for (let reservationId of reservationIdOfReservations) {
    //   console.log(reservationIdOfReservations.indexOf(reservationId), reservationId);
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
    let tableIdOftableReservations = [];
    for (let tableReservation of tableReservations) {
      // console.log(
      //   tableReservations.indexOf(tableReservation),
      //   tableReservation.dataValues
      // );
      if (
        !tableIdOftableReservations.includes(
          tableReservation.dataValues.tableId
        )
      ) {
        tableIdOftableReservations.push(tableReservation.dataValues.tableId);
      }
    }
    // for (let tableIdOftableReservation of tableIdOftableReservations) {
    //   console.log(
    //     tableIdOftableReservations.indexOf(tableIdOftableReservation),
    //     tableIdOftableReservation
    //   );
    // }
    tables.forEach((element) => {
      if (tableIdOftableReservations.includes(element.dataValues.tableId)) {
        element.dataValues.available = 0; //ko trống
      } else {
        element.dataValues.available = 1; //trống
      }
      delete element.dataValues.isDel;
    });
    res.status(200).json({
      isSuccess: true,
      data: {
        tables,
      },
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Lỗi khi lấy danh sách bàn",
    });
  }
};

const checkAvailableTable = async (req, res) => {
  try {
    let { tableTypeId, countGuest, schedule } = req.body;
    let countTable = Math.ceil(countGuest / 4);
    let reservations;
    let tables, tableReservations;
    convertedSchedule = new Date(schedule);
    // trên dưới 4h tính từ thời gian truyền vào,
    // những table nào trống => available
    let startSchedule = new Date(
      convertedSchedule.getTime() - 4 * 60 * 60 * 1000
    );
    let endSchedule = new Date(
      convertedSchedule.getTime() + 4 * 60 * 60 * 1000
    );
    console.log("datetime", convertedSchedule);
    console.log("startDateTime:", startSchedule);
    console.log("endDateTime:", endSchedule);
    // Truy vấn tất cả những reservation, và table thỏa điều kiện
    reservations = await Reservation.findAll({
      where: {
        schedule: {
          [Op.between]: [startSchedule, endSchedule], //tìm những reservation mà thời gian diễn ra nằm trong khoảng này
        },
        [Op.not]: [
          {
            status: -1, //không lấy đơn đặt bàn bị từ chối
          },
        ],
      },
    });
    tables = await Table.findAll({
      where: {
        tableTypeId: tableTypeId,
      },
    });
    //khai báo array chưa reservationIdOfReservations
    let reservationIdOfReservations = [];
    for (let reservation of reservations) {
      // console.log(reservations.indexOf(reservation), reservation.dataValues);
      //kiểm tra chưa tồn tại trong array thì push reservationId vào
      if (
        !reservationIdOfReservations.includes(
          reservation.dataValues.reservationId
        )
      ) {
        reservationIdOfReservations.push(reservation.dataValues.reservationId);
      }
    }
    // for (let reservationId of reservationIdOfReservations) {
    //   console.log(reservationIdOfReservations.indexOf(reservationId), reservationId);
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
    let tableIdOftableReservations = [];
    for (let tableReservation of tableReservations) {
      console.log(
        tableReservations.indexOf(tableReservation),
        tableReservation.dataValues
      );
      if (
        !tableIdOftableReservations.includes(
          tableReservation.dataValues.tableId
        )
      ) {
        tableIdOftableReservations.push(tableReservation.dataValues.tableId);
      }
    }
    // for (let tableIdOftableReservation of tableIdOftableReservations) {
    //   console.log(
    //     tableIdOftableReservations.indexOf(tableIdOftableReservation),
    //     tableIdOftableReservation
    //   );
    // }
    tables.forEach((element) => {
      if (tableIdOftableReservations.includes(element.dataValues.tableId)) {
        element.dataValues.available = 0; //ko trống
      } else {
        element.dataValues.available = 1; //trống
      }
      delete element.dataValues.isDel;
    });
    console.log("available", tables.length, countTable);
    if (tables.length >= countTable) {
      res.status(200).json({
        isSuccess: true,
        data: {
          isAvailable: true,
        },
        msg:
          "Chỗ trống có sẵn vào " + schedule + " với " + countGuest + " khách",
      });
    } else {
      res.status(200).json({
        isSuccess: true,
        data: {
          isAvailable: false,
        },
        msg:
          "Chỗ trống không có sẵn vào " +
          schedule +
          " với " +
          countGuest +
          " khách",
      });
    }
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Lỗi khi kiểm tra bàn",
    });
  }
};

const getAllTableType = async (req, res) => {
  try {
    const tableTypes = await TableType.findAll();
    res.status(200).json({
      isSuccess: true,
      data: tableTypes,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Lỗi lấy danh sách loại bàn",
    });
  }
};

module.exports = {
  getAllTableByDate,
  checkAvailableTable,
  getAllTableType,
};
