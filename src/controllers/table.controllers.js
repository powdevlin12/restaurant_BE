const { where } = require("sequelize");
const { Table, Reservation, Table_Reservation } = require("../models");
const db = require("../models/index");
const { Op } = require("sequelize");
const moment = require("moment");

const getAllTableByDate = async (req, res) => {
  try {
    let { datetime, tableType } = req.body;
    console.log("here", datetime);

    let result;
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
    if (!tableType) {
      reservations = await Reservation.findAll({
        where: {
          schedule: {
            [Op.between]: [startDateTime, endDateTime], //tìm những reservation mà thời gian diễn ra nằm trong khoảng này
          },
          [Op.not]: [
            {
              status: -1, //không lấy đơn đặt bàn bị từ chối
            },
          ],
        },
      });
      tables = await Table.findAll();
    } else {
      reservations = await Reservation.findAll({
        where: {
          schedule: {
            [Op.between]: [startDateTime, endDateTime], //tìm những reservation mà thời gian diễn ra nằm trong khoảng này
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
          tableTypeId: tableType,
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
    res.status(500).json({
      isSuccess: true,
      tables,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Lỗi khi lấy danh sách bàn",
    });
  }
};

module.exports = {
  getAllTableByDate,
};
