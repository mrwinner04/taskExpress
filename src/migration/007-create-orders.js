"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("orders", {
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
      number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM("sales", "purchase", "transfer"),
        allowNull: false,
      },
      customerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "customers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      warehouseId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "warehouses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
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

    await queryInterface.addIndex("orders", ["companyId"]);
    await queryInterface.addIndex("orders", ["number"]);
    await queryInterface.addIndex("orders", ["type"]);
    await queryInterface.addIndex("orders", ["customerId"]);
    await queryInterface.addIndex("orders", ["warehouseId"]);
    await queryInterface.addIndex("orders", ["date"]);
    await queryInterface.addIndex("orders", ["deletedAt"]);

    await queryInterface.addConstraint("orders", {
      fields: ["companyId", "number"],
      type: "unique",
      name: "orders_company_number_unique",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("orders");
  },
};
