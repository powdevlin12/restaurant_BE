"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    static associate(models) {
      this.belongsTo(models.TableType, {
        foreignKey: "tableTypeId",
      });
      this.hasMany(models.Table_Reservation, {
        foreignKey: "tableId",
      });
    }
  }
  Table.init(
    {
      tableId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      isDel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Table",
    }
  );
  return Table;
};
