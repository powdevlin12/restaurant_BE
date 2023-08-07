"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DishType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Dish, {
        foreignKey: "dishTypeId",
      });
      // define association here
    }
  }
  DishType.init(
    {
      dishTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      isDrinkType: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "DishType",
      timestamps: false,
    }
  );
  return DishType;
};
