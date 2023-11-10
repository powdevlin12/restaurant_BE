let express = require("express");
const { Reservation } = require("../models");
let router = express.Router();
const moment = require("moment");

router.get("/create_payment_url", function (req, res, next) {
  const amount = req.query.amount;
  const id_order = req.query.id_order;
  res.render("vnpay/order", {
    title: "Test",
    amount: amount,
    id_order: id_order,
  });
});

router.post("/create_payment_url", async function (req, res, next) {
  let amount = req.body.amount;
  let reservationId = req.body.id_order;
  try {
    const reservation = await Reservation.findOne({
      where: {
        reservationId,
        preFee: amount,
      },
    });
    if (reservation) {
      if (reservation.status == 0) {
        res.render("vnpay/success", {
          flag: 2,
          message: "Hoá đơn của bạn đã được thanh toán.",
        });
      }
      // else if(reservation.id_payment != 1){
      //     res.render('vnpay/success', {flag: 2, message: "Hoá đơn này phải thanh toán khi nhận hàng."})
      // }
      else {
        process.env.TZ = "Asia/Ho_Chi_Minh";

        let date = new Date();
        let createDate = moment(date).format("YYYYMMDDHHmmss");

        let ipAddr =
          req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress;

        let config = require("../config/default.json");

        let tmnCode = config.vnp_TmnCode;
        let secretKey = config.vnp_HashSecret;
        let vnpUrl = config.vnp_Url;
        let returnUrl = config.vnp_ReturnUrl;
        let bankCode = req.body.bankCode;

        let locale = req.body.language;
        if (locale === null || locale === "") {
          locale = "vn";
        }
        let currCode = "VND";
        let vnp_Params = {};
        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        vnp_Params["vnp_Locale"] = locale;
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = reservationId;
        vnp_Params["vnp_OrderInfo"] =
          "Thanh toán cho mã đặt bàn:" + reservationId;
        vnp_Params["vnp_OrderType"] = "other";
        vnp_Params["vnp_Amount"] = amount * 100;
        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;
        if (bankCode !== null && bankCode !== "") {
          vnp_Params["vnp_BankCode"] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        let querystring = require("qs");
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

        res.redirect(vnpUrl);
      }
    } else if (amount <= 0) {
      res.render("vnpay/success", {
        flag: 2,
        message: "Số tiền phải lớn hơn 0.",
      });
    } else if (reservationId <= 0) {
      res.render("vnpay/success", {
        flag: 2,
        message: "Mã đơn hàng phải lớn hơn 0.",
      });
    } else {
      res.render("vnpay/success", {
        flag: 2,
        message: "Số tiền thanh toán không khớp với hoá đơn.",
      });
    }
  } catch (error) {
    res.render("vnpay/success", { flag: 2, message: error });
  }
});

router.get("/vnpay_return", async function (req, res, next) {
  try {
    let vnp_Params = req.query;

    let secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    let amount = vnp_Params.vnp_Amount / 100;
    let reservationId = vnp_Params.vnp_TxnRef;

    let config = require("../config/default.json");
    let secretKey = config.vnp_HashSecret;

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    // if(secureHash === signed){
    console.log(amount, reservationId);
    const reservation = await Reservation.findOne({
      where: {
        reservationId,
        preFee: amount,
      },
    });
    reservation.status = 0;
    await reservation.save();
    res.render("vnpay/success", { flag: 1 });
  } catch (error) {
    res.render("vnpay/success", { flag: 2, message: error });
  }
});

router.post("/refund", function (req, res, next) {
  process.env.TZ = "Asia/Ho_Chi_Minh";
  let date = new Date();

  let config = require("config");
  let crypto = require("crypto");

  let vnp_TmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");
  let vnp_Api = config.get("vnp_Api");

  let vnp_TxnRef = req.body.orderId;
  let vnp_TransactionDate = req.body.transDate;
  let vnp_Amount = req.body.amount * 100;
  let vnp_TransactionType = req.body.transType;
  let vnp_CreateBy = req.body.user;

  let currCode = "VND";

  let vnp_RequestId = moment(date).format("HHmmss");
  let vnp_Version = "2.1.0";
  let vnp_Command = "refund";
  let vnp_OrderInfo = "Hoan tien GD ma:" + vnp_TxnRef;

  let vnp_IpAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

  let vnp_TransactionNo = "0";

  let data =
    vnp_RequestId +
    "|" +
    vnp_Version +
    "|" +
    vnp_Command +
    "|" +
    vnp_TmnCode +
    "|" +
    vnp_TransactionType +
    "|" +
    vnp_TxnRef +
    "|" +
    vnp_Amount +
    "|" +
    vnp_TransactionNo +
    "|" +
    vnp_TransactionDate +
    "|" +
    vnp_CreateBy +
    "|" +
    vnp_CreateDate +
    "|" +
    vnp_IpAddr +
    "|" +
    vnp_OrderInfo;
  let hmac = crypto.createHmac("sha512", secretKey);
  let vnp_SecureHash = hmac.update(new Buffer(data, "utf-8")).digest("hex");

  let dataObj = {
    vnp_RequestId: vnp_RequestId,
    vnp_Version: vnp_Version,
    vnp_Command: vnp_Command,
    vnp_TmnCode: vnp_TmnCode,
    vnp_TransactionType: vnp_TransactionType,
    vnp_TxnRef: vnp_TxnRef,
    vnp_Amount: vnp_Amount,
    vnp_TransactionNo: vnp_TransactionNo,
    vnp_CreateBy: vnp_CreateBy,
    vnp_OrderInfo: vnp_OrderInfo,
    vnp_TransactionDate: vnp_TransactionDate,
    vnp_CreateDate: vnp_CreateDate,
    vnp_IpAddr: vnp_IpAddr,
    vnp_SecureHash: vnp_SecureHash,
  };

  request(
    {
      url: vnp_Api,
      method: "POST",
      json: true,
      body: dataObj,
    },
    function (error, response, body) {
      console.log(response);
    }
  );
});

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = router;
