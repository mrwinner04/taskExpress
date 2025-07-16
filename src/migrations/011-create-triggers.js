"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Timestamp triggers for all tables
    const tables = [
      "companies",
      "customers",
      "order_items",
      "orders",
      "products",
      "users",
      "warehouses",
      "invoices",
    ];

    for (const table of tables) {
      await queryInterface.sequelize.query(`
        CREATE TRIGGER trg_set_timestamps
        BEFORE INSERT OR UPDATE ON ${table}
        FOR EACH ROW EXECUTE FUNCTION set_timestamps();
      `);
    }

    // Trigger to prevent ordering deleted products
    await queryInterface.sequelize.query(`
      CREATE TRIGGER trg_no_deleted_products
      BEFORE INSERT ON order_items
      FOR EACH ROW EXECUTE FUNCTION prevent_ordering_deleted_products();
    `);

    // Trigger to prevent negative stock
    await queryInterface.sequelize.query(`
      CREATE TRIGGER trg_prevent_negative_stock
      BEFORE INSERT OR UPDATE ON order_items
      FOR EACH ROW EXECUTE FUNCTION prevent_negative_stock();
    `);

    // Trigger to generate order numbers automatically
    await queryInterface.sequelize.query(`
      CREATE TRIGGER trg_generate_order_number
      BEFORE INSERT ON orders
      FOR EACH ROW 
      WHEN (NEW.number IS NULL)
      EXECUTE FUNCTION generate_order_number();
    `);

    // Trigger to create invoice automatically on order creation
    await queryInterface.sequelize.query(`
      CREATE TRIGGER trg_create_invoice_on_order
      AFTER INSERT ON orders
      FOR EACH ROW EXECUTE FUNCTION create_invoice_on_order();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop all triggers
    const tables = [
      "companies",
      "customers",
      "order_items",
      "orders",
      "products",
      "users",
      "warehouses",
      "invoices",
    ];

    for (const table of tables) {
      await queryInterface.sequelize.query(
        `DROP TRIGGER IF EXISTS trg_set_timestamps ON ${table};`
      );
    }

    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS trg_no_deleted_products ON order_items;`
    );
    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS trg_prevent_negative_stock ON order_items;`
    );
    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS trg_generate_order_number ON orders;`
    );
    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS trg_create_invoice_on_order ON orders;`
    );
  },
};
