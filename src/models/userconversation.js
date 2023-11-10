'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserConversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Conversation, {
        foreignKey: 'conversationId'
      })

      this.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  UserConversation.init({
    userConversationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
  }, {
    sequelize,
    modelName: 'UserConversation',
  });
  return UserConversation;
};