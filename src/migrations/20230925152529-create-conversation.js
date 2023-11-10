'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("Conversations", {
      conversationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      messageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Messages",
          key: "messageId",
        },
      },
      lastMessageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Messages",
          key: "messageId",
        },
      },
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
