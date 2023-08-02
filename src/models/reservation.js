"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      this.hasOne(models.Menu_User, {
        foreignKey: "reservationId",
      });
      this.hasOne(models.Service_Reservation, {
        foreignKey: "reservationId",
      });
    }
  }
  Reservation.init(
    {
      reservationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      schedule: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Reservation",
    }
  );
  return Reservation;
};
