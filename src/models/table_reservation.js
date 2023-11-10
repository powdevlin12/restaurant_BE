"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Table_Reservation extends Model {
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
      this.belongsTo(models.Table, {
        foreignKey: "tableId",
      });
    }
  }
  Table_Reservation.init(
    {
      tableReservationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Table_Reservation",
    }
  );
  return Table_Reservation;
};
