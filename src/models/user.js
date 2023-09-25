"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Account, {
        foreignKey: "accountId",
      });

      this.hasMany(models.Message, {
        foreignKey: 'messageId', as: 'senderId'
      });

      this.hasMany(models.Reservation, {
        foreignKey: "userId",
      })

      this.belongsToMany(models.Conversation, {
        through: 'UserConversation',
      });
    }
  }
  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      gender: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "User",
    }
  );
  return User;
};
