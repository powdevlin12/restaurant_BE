"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Service_Reservation extends Model {
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
      this.belongsTo(models.Service, {
        foreignKey: "serviceId",
      });
    }
  }
  Service_Reservation.init(
    {
      reservationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Reservation",
          key: "reservationId",
        },
      },
      serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Service",
          key: "serviceId",
        },
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
      modelName: "Service_Reservation",
    }
  );
  return Service_Reservation;
};
