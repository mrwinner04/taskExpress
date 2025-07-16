"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("invoices", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        primaryKey: true,
        allowNull: false,
      },
      companyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "companies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      modifiedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
    });

    await queryInterface.addIndex("invoices", ["companyId"]);
    await queryInterface.addIndex("invoices", ["orderId"]);
    await queryInterface.addIndex("invoices", ["number"]);
    await queryInterface.addIndex("invoices", ["status"]);
    await queryInterface.addIndex("invoices", ["date"]);
    await queryInterface.addIndex("invoices", ["deletedAt"]);

    await queryInterface.addConstraint("invoices", {
      fields: ["companyId", "number"],
      type: "unique",
      name: "invoices_company_number_unique",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("invoices");
  },
};
