"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Message, {
        foreignKey: 'messageId'
      });

      this.belongsToMany(models.User, {
        through: 'UserConversation',
      });

      this.hasOne(models.Message, { foreignKey: 'lastMessageId' });
    }
  }
  Conversation.init(
    {

    },
    {
      sequelize,
      modelName: "Conversation",
      timestamps: true,
    }
  );
  return Conversation;
};
