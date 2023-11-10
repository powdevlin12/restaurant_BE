"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TableType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Table, {
        foreignKey: "tableTypeId",
      });
      // define association here
    }
  }
  TableType.init(
    {
      tableTypeId: {
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
      description: {
        type: DataTypes.STRING,
      },
      fee: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "TableType",
    }
  );
  return TableType;
};
