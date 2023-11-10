"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Dishes", {
      dishId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
      },
      isDel: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0, //0: ko xóa, 1: xóa
      },
      dishTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "DishTypes",
          key: "dishTypeId",
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Dishes");
  },
};
