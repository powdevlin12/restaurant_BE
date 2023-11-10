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
      this.hasMany(models.Menu_Reservation, {
        foreignKey: "reservationId",
      });
      this.hasMany(models.Service_Reservation, {
        foreignKey: "reservationId",
      });
      this.hasMany(models.Table_Reservation, {
        foreignKey: "reservationId",
      });
      this.hasOne(models.Invoice, {
        foreignKey: "reservationId",
      });
      this.belongsTo(models.User, {
        foreignKey: "userId",
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
      countGuest: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      schedule: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      note: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      preFee: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      refundFee: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      managerNote: {
        type: DataTypes.STRING,
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
