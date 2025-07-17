"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE customer_type AS ENUM ('customer', 'supplier');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE order_type AS ENUM ('sales', 'purchase', 'transfer');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE product_type AS ENUM ('solid', 'liquid');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop enum types
    await queryInterface.sequelize.query("DROP TYPE IF EXISTS customer_type;");
    await queryInterface.sequelize.query("DROP TYPE IF EXISTS order_type;");
    await queryInterface.sequelize.query("DROP TYPE IF EXISTS product_type;");
  },
};
