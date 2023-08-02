"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Roles", [
      {
        name: "admin",
      },
      {
        name: "manager",
      },
      {
        name: "client",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
