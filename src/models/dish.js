"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Dish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.DishType, {
        foreignKey: "dishTypeId",
      });
      this.hasMany(models.Menu, {
        foreignKey: "dishId",
      });
      this.hasMany(models.Menu_Reservation, {
        foreignKey: "dishId",
      });
    }
  }
  Dish.init(
    {
      dishId: {
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
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
      isDel: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0, //0: ko xóa, 1: xóa
      },
    },
    {
      sequelize,
      modelName: "Dish",
      timestamps: false,
    }
  );
  return Dish;
};
