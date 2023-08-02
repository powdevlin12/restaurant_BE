"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Tables", [
      {
        name: "Bàn 01",
      },
      {
        name: "Bàn 02",
      },
      {
        name: "Bàn 03",
      },
      {
        name: "Bàn 04",
      },
      {
        name: "Bàn 05",
      },
      {
        name: "Bàn 06",
      },
      {
        name: "Bàn 07",
      },
      {
        name: "Bàn 08",
      },
      {
        name: "Bàn 09",
      },
      {
        name: "Bàn 10",
      },
      {
        name: "Bàn 11",
      },
      {
        name: "Bàn 12",
      },
      {
        name: "Bàn 13",
      },
      {
        name: "Bàn 14",
      },
      {
        name: "Bàn 15",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
