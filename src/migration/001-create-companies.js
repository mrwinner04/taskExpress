"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );

    await queryInterface.createTable("companies", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      modifiedBy: {
        type: Sequelize.UUID,
        allowNull: true,
      },
    });

    await queryInterface.addIndex("companies", ["name"]);
    await queryInterface.addIndex("companies", ["deletedAt"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("companies");
  },
};
