"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Dish, {
        foreignKey: "dishId",
      });
    }
  }
  Menu.init(
    {
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true,
      },
      dishId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Dish",
          key: "dishId",
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Menu",
    }
  );
  return Menu;
};
