const express = require("express");
const { sequelize } = require("./src/models");
const { rootRouter } = require("./src/routers");
const { QueryTypes } = require("sequelize");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const PORT = 3005;
const app = express();
const cron = require("cron");
const cors = require("cors");
var vnpay = require("./src/routers/vnpay");

app.use(cookieParser());
app.use(cors());
const expHBS = require("express-handlebars");

//đọc được json
app.use(express.json());
//cài static file
app.use(express.static(path.join(__dirname, "public")));
//đọc được array, object
app.use(express.urlencoded({ extended: true }));

//call route
app.use(rootRouter);

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

/* SETUP PAYMENT */
var hbs = expHBS.create({
  extname: "hbs",
  helpers: {
    ifcond: function (v1, v2, options) {
      if (v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
  },
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));
console.log(__dirname);
app.use("/vnpay", vnpay);

/*  PASSPORT SETUP  */
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

const {
  remindUnpaitReservationByEmail,
  deleteUnpaidReservation,
} = require("./src/cronjob/reservation");

// const job = new cron.CronJob("0 */30 * * * *", async () => {
//   // Mã thực hiện xoá các reservation không được thanh toán phí trả trước mỗi 30 phút
//   await deleteUnpaidReservation();
// });

const job = new cron.CronJob("*/30 * * * * *", async () => {
  // Mã thực hiện xoá các reservation không được thanh toán phí trả trước mỗi 30 giây
  await deleteUnpaidReservation();
});

const remindJob = new cron.CronJob("*/15 * * * * *", async () => {
  // Mã thực hiện gửi mail nhắc nhở các reservation không được thanh toán phí trả trước mỗi 20 giây
  await remindUnpaitReservationByEmail();
});

// Bắt đầu công việc cron
// job.start();
// remindJob.start();

const listener = app.listen(PORT, async () => {
  console.log(`App listening on http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Kết nối thành công!");
  } catch (error) {
    console.error("Kết nối thất bại:", error);
  }
});
