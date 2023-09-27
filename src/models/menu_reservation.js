"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Menu_Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Reservation, {
        foreignKey: "reservationId",
      });
      this.belongsTo(models.Dish, {
        foreignKey: "dishId",
      });
    }
  }
  Menu_Reservation.init(
    {
      menuReservationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Menu_Reservation",
    }
  );
  return Menu_Reservation;
};
