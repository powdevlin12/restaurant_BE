"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        userName: "AnhDucTaiSacVenToan",
        accountId: 1,
      },
      {
        userName: "LeMauAnhDuc",
        accountId: 2,
      },
      {
        userName: "Lê Mậu Anh Đức",
        accountId: 3,
      },
      {
        userName: "Anh Đức",
        accountId: 4,
      },
      {
        userName: "Mậu Anh Đức",
        accountId: 5,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
