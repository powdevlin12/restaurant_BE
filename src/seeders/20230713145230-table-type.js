"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("TableTypes", [
      {
        name: "VIP",
        description: "Riêng tư, có điều hòa",
        fee: 300000,
      },
      {
        name: "Ban công",
        description: "Vị trí ban công, về đêm có view đẹp",
        fee: 200000,
      },
      {
        name: "Ngoài trời",
        description: "",
        fee: 0,
      },
      {
        name: "Không hút thuốc",
        description: "Cấm sử dụng thuốc lá cũng như thuốc lá điện thử",
        fee: 0,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
