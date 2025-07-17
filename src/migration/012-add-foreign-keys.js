"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("companies", {
      fields: ["modifiedBy"],
      type: "foreign key",
      name: "companies_modified_by_fkey",
      references: {
        table: "users",
        field: "id",
      },
      onUpdate: "SET NULL",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      "companies",
      "companies_modified_by_fkey"
    );
  },
};
