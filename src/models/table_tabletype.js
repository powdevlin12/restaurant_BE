"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Table_TableType extends Model {
    static associate(models) {
      this.belongsTo(models.Table, {
        foreignKey: "tableId",
      });
      this.belongsTo(models.TableType, {
        foreignKey: "tableTypeId",
      });
      // define association here
    }
  }
  Table_TableType.init(
    {
      tableId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Table",
          key: "tableId",
        },
      },
      tableTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "TableType",
          key: "tableTypeId",
        },
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Table_TableType",
    }
  );
  return Table_TableType;
};
