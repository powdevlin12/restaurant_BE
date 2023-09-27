"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // association Message vs User
      this.belongsTo(models.User, { foreignKey: 'userId' });

      // association Message vs Conversation
      this.belongsTo(models.Conversation, { foreignKey: 'conversationId' });
    }
  }
  Message.init(
    {
      messageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "Message",
      timestamps: true,
    }
  );
  return Message;
};
