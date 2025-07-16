"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add foreign key constraint from companies.modifiedby to users.id
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
    // Remove the foreign key constraint
    await queryInterface.removeConstraint(
      "companies",
      "companies_modified_by_fkey"
    );
  },
};
