const {
  Reservation,
  Menu_Reservation,
  User,
  Account,
  Table_Reservation,
  Service_Reservation,
} = require("../models");
const db = require("../models/index");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const moment = require("moment");

async function remindUnpaitReservationByEmail() {
  try {
    const date = moment().format("YYYY-MM-DD HH:mm:ss");
    let reservations = await Reservation.findAll({
      where: {
        status: -2, //chưa thanh toán
        [Op.not]: [{ preFee: 0 }],
        createAt: {
          [Op.lt]: moment().subtract(30, "minutes"),
        },
      },
      include: [{ model: User, include: [{ model: Account }] }],
      raw: true,
    });
    for (let reservation of reservations) {
      console.log(reservation);
      let email = reservation["User.Account.email"];
      let schedule = new Date(reservation.schedule);
      let year = schedule.getFullYear();
      let month = String(schedule.getMonth() + 1).padStart(2, "0");
      let day = String(schedule.getDate()).padStart(2, "0");
      let hour = String(schedule.getHours()).padStart(2, "0");
      let min = String(schedule.getMinutes()).padStart(2, "0");
      schedule =
        hour +
        " giờ " +
        min +
        " phút, ngày " +
        day +
        " tháng " +
        month +
        " năm " +
        year;
      let createAt = new Date(reservation.createAt);
      let deadline = new Date(createAt.getTime() - 30 * 60 * 1000);
      year = createAt.getFullYear();
      month = String(createAt.getMonth() + 1).padStart(2, "0");
      day = String(createAt.getDate()).padStart(2, "0");
      hour = String(createAt.getHours()).padStart(2, "0");
      min = String(createAt.getMinutes()).padStart(2, "0");
      createAt =
        hour +
        " giờ " +
        min +
        " phút, ngày " +
        day +
        " tháng " +
        month +
        " năm " +
        year;
      year = deadline.getFullYear();
      month = String(deadline.getMonth() + 1).padStart(2, "0");
      day = String(deadline.getDate()).padStart(2, "0");
      hour = String(deadline.getHours()).padStart(2, "0");
      min = String(deadline.getMinutes()).padStart(2, "0");
      deadline =
        hour +
        " giờ " +
        min +
        " phút, ngày " +
        day +
        " tháng " +
        month +
        " năm " +
        year;
      transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "n19dccn038@student.ptithcm.edu.vn", // generated ethereal user
          pass: "fxysqktsjuembqvu", // generated ethereal password
        },
      });
      // send mail with defined transport object
      await transporter.sendMail({
        from: '"Firestaurant 👻"<n19dccn038@student.ptithcm.edu.vn>', // sender address
        // from: "n19dccn107@student.ptithcm.edu.vn", // sender address
        to: `${email}`, // list of receivers
        subject: "UNPAID PRE-FEE RESERVATION", // Subject line
        text: "UNPAID PRE-FEE RESERVATION", // plain text body
        html: `<div>Bạn <span style="color:red;font-size: 14px">CHƯA</span> thanh toán phí trả trước yêu cầu đặt bàn, chi tiết:</div>
        <div>Thời gian đặt: ${createAt}</div>
        <div>Thời gian diễn ra: ${schedule}</div>
        <div>Vui lòng thành toán mức phí trả trước là <span style="color:blue;">${reservation.preFee.toLocaleString()}</span> đồng trước ${deadline}. Nếu không, nhà hàng sẽ <span style="color:red;font-size: 14px">HỦY</span> đơn đặt bàn này! </div>`, // html body
      });
    }
    console.log("Unpaid reservation remind successfully.");
  } catch (error) {
    console.error("Error remind unpaid reservation:", error);
  }
}

async function deleteUnpaidReservation() {
  try {
    const date = moment().format("YYYY-MM-DD HH:mm:ss");
    let reservations = await Reservation.findAll({
      where: {
        status: -2, //chưa thanh toán
        createAt: {
          [Op.lt]: moment().subtract(30, "minutes"),
        },
      },
      raw: true,
    });

    for (let reservation of reservations) {
      const transaction = await db.sequelize.transaction(); // Bắt đầu transaction
      try {
        await Table_Reservation.destroy(
          {
            where: {
              reservationId: reservation.reservationId,
            },
          },
          { transaction: transaction }
        );
        await Menu_Reservation.destroy(
          {
            where: {
              reservationId: reservation.reservationId,
            },
          },
          { transaction: transaction }
        );
        await Service_Reservation.destroy(
          {
            where: {
              reservationId: reservation.reservationId,
            },
          },
          { transaction: transaction }
        );
        await Reservation.destroy(
          {
            where: {
              reservationId: reservation.reservationId,
            },
          },
          { transaction: transaction }
        );
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
      }
    }

    console.log("Unpaid reservation deleted successfully.");
  } catch (error) {
    console.error("Error deleting unpaid reservation:", error);
  }
}

module.exports = {
  remindUnpaitReservationByEmail,
  deleteUnpaidReservation,
};
