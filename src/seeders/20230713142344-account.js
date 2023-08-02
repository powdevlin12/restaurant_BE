"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Accounts", [
      {
        phone: "0941555025",
        password: "123",
        roleId: 1,
        forgot: 0,
      },
      {
        phone: "0941555026",
        password: "123",
        roleId: 2,
        forgot: 0,
      },
      {
        phone: "0941555027",
        password: "123",
        roleId: 3,
        forgot: 0,
      },
      {
        phone: "0941555028",
        password: "123",
        roleId: 3,
        forgot: 0,
      },
      {
        phone: "0941555029",
        password: "123",
        roleId: 2,
        forgot: 0,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
