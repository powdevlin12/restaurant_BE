const { Account, User, Role } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {Op} = require("sequelize");

const createAccountForClient = async (req, res) => {
  try {
    const { phone, email, password, userName, gender, address, birthDay } = req.body;
    //tạo ra một chuỗi ngẫu nhiên
    const salt = bcrypt.genSaltSync(10);
    //mã hóa salt + password
    const hashPassword = bcrypt.hashSync(password, salt);
    const newAccount = await Account.create({
      phone: phone,
      email: email,
      password: hashPassword,
      roleId: 3, //client
    });
    const newClient = await User.create({
      accountId: newAccount.accountId,
      userName: userName,
      gender: gender,
      address: address,
      birthDay: birthDay,
    });

    res.status(200).json({
      isExist: false,
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      isExist: true,
      isSuccess: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { login, password } = req.body;
    const account = await Account.findOne({
      where: {
       [Op.or] : [
        {phone: login},
        {email: login},
       ]
      },
    });
    const isAuth = bcrypt.compareSync(password, account.password);
    if (isAuth) {
      const user = await User.findOne({
        where: {
          accountId: account.accountId,
        },
      });
      const token = jwt.sign({ phone: account.phone }, "hehehe", {
        expiresIn: 24 * 60 * 60,
      });
      const role = await Role.findOne({
        where: {
          roleId: account.roleId,
        },
      });
      res.status(200).json({
        userId: user.userId,
        userName: user.userName,
        address: user.address,
        birthDay: user.birthDay,
        gender: user.gender,
        role: role.name,
        roleId: role.roleId,
        isSuccess: true,
        accessToken: token,
        expireTime: 24 * 60 * 60,
      });
    } else {
      res.status(400).json({
        isSuccess: false,
      });
    }
  } catch (error) {
    res.status(400).json({
      isSuccess: false,
    });
  }
};

const changePassword = async (res, req) => {
  try {
    const { oldPassword, newPassword, repeatPassword } = req.body;
    const account = await Account.findOne({
      where: {
        phone: req.phone,
      },
    });
    const isAuth = bcrypt.compareSync(oldPassword, account.password);
    if (isAuth) {
      if (newPassword == repeatPassword) {
        if (newPassword == oldPassword) {
          res.status(400).json({
            status: true,
          });
        } else {
          //tạo ra một chuỗi ngẫu nhiên
          const salt = bcrypt.genSaltSync(10);
          //mã hoá salt + password
          const hashPassword = bcrypt.hashSync(newPassword, salt);

          accountUpdate.password = hashPassword;
          await accountUpdate.save();
          res.status(200).json({
            status: true,
            isSuccess: true,
          });
        }
      } else {
        res.status(400).json({
          status: true,
          isSuccess: false,
        });
      }
    } else {
      res.status(400).json({
        status: false,
        isSuccess: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: true,
      isSuccess: false,
    });
  }
};

const logout = async (req, res, next) => {
  res.removeHeader("access_token");

  res.status(200).json({ isSuccess: true });
};

const forgotPassword = async (req, res) => {
  const { mail } = req.body;
  try {
    // const randomID = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    // const isExist1 = await Account.findOne({
    //     where: {
    //         forgot: randomID,
    //     },
    // });
    // if (isExist1 !== null) {
    //     res.status(400).json({
    //         isExist: true,
    //         isSuccess:false
    //     });
    // } else {
    //     await Account.sequelize.query(
    //         "UPDATE accounts SET forgot = :randomID WHERE mail = :mail",
    //         {
    //             type: QueryTypes.UPDATE,
    //             replacements: {
    //                 randomID: randomID,
    //                 mail: mail,
    //             },
    //         }
    //     );
    //     let transporter = nodemailer.createTransport({
    //         host: "smtp.gmail.com",
    //         port: 587,
    //         secure: false, // true for 465, false for other ports
    //         auth: {
    //             user: "trannhatquan.2001@gmail.com", // generated ethereal user
    //             pass: "bseuvtvsghpnrltz", // generated ethereal password
    //         },
    //     });
    //     // send mail with defined transport object
    //     await transporter.sendMail({
    //         from: "trannhatquan.2001@gmail.com", // sender address
    //         to: `${mail}`, // list of receivers
    //         subject: "FORGOT PASSWORD", // Subject line
    //         text: "FORGOT PASSWORD", // plain text body
    //         html: `Your OTP: ${randomID}`, // html body
    //     });
    //     return res.status(200).json({
    //         isExist: true,
    //         isSuccess: true,
    //         message: `Mã xác minh đã được gửi về email: ${mail} vui lòng kiểm tra hòm thư!`,
    //     });
    // }
  } catch (error) {
    res.status(500).json({
      isExist: true,
      isSuccess: false,
    });
  }
};

const verify = async (req, res, next) => {
  const { verifyId, phone } = req.body;
  const account = await Account.findOne({
    where: {
      forgot: verifyId,
      phone,
    },
    raw: true,
  });
  if (account) {
    res.status(200).json({
      msg: `Mã xác nhận chính xác!`,
      isSuccess: true,
    });
  } else {
    res.status(400).json({
      msg: `Mã xác nhận không chính xác!`,
      isSuccess: false,
    });
  }
};

const accessForgotPassword = async (req, res, next) => {
  const { mail, password, repeatPassword } = req.body;
  if (password != repeatPassword) {
    res.status(400).json({
      msg: `Mật khẩu lặp lại không chính xác!`,
      isSuccess: false,
    });
  } else {
    const salt = bcrypt.genSaltSync(10);
    //mã hoá salt + password
    const hashPassword = bcrypt.hashSync(password, salt);
    try {
      const accountUpdate = await Account.findOne({
        where: {
          mail,
        },
      });
      accountUpdate.password = hashPassword;
      accountUpdate.forgot = 0;

      await accountUpdate.save();
      res.status(200).json({
        msg: `Lấy lại mật khẩu thành công!`,
        isSuccess: true,
      });
    } catch (error) {
      res.status(500).json({
        msg: `Lấy lại mật khẩu thất bại!`,
        isSuccess: false,
      });
    }
  }
};
module.exports = {
  login,
  logout,
  createAccountForClient,
  verify,
  forgotPassword,
  accessForgotPassword,
  changePassword,
};
