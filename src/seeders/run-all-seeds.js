"use strict";

const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");

const config = require("../config/config.js");

async function runAllSeeds() {
  const sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    {
      host: config.development.host,
      port: config.development.port,
      dialect: config.development.dialect,
      logging: console.log,
    }
  );

  try {
    await sequelize.authenticate();
    console.log(" Database connection established successfully");

    // Define seed files in dependency order
    const seedFiles = [
      "001-companies.js",
      "002-users.js",
      "003-customers.js",
      "004-warehouses.js",
      "005-products.js",
      "006-orders.js",
      "007-order-items.js",
      "008-invoices.js",
    ];

    console.log("\nStarting database seeding process...\n");

    console.log("🔧 Disabling stock validation trigger for seeding...");
    await sequelize.query(
      "DROP TRIGGER IF EXISTS trg_prevent_negative_stock ON order_items;"
    );

    for (const seedFile of seedFiles) {
      const seedPath = path.join(__dirname, seedFile);

      if (fs.existsSync(seedPath)) {
        console.log(`📦 Running seed: ${seedFile}`);

        try {
          const seedModule = require(seedPath);
          await seedModule.up(sequelize.getQueryInterface(), Sequelize);
          console.log(`✅ Completed seed: ${seedFile}\n`);
        } catch (error) {
          console.error(`❌ Error in seed ${seedFile}:`, error.message);
          throw error;
        }
      } else {
        console.log(`⚠️  Seed file not found: ${seedFile}`);
      }
    }

    // Re-enable trigger
    console.log("🔧 Re-enabling stock validation trigger...");
    await sequelize.query(`
      CREATE TRIGGER trg_prevent_negative_stock
      BEFORE INSERT OR UPDATE ON order_items
      FOR EACH ROW EXECUTE FUNCTION prevent_negative_stock();
    `);

    console.log("🎉 All seeds completed successfully!");
    console.log("\n📊 Sample data has been created for:");
    console.log("• 3 Companies with different business types");
    console.log("• 6 Users across all companies");
    console.log("• 9 Customers/Suppliers for business relationships");
    console.log("• 6 Warehouses for inventory management");
    console.log("• 12 Products with various types and prices");
    console.log("• 12 Orders (purchase, sales, transfer)");
    console.log("• 25 Order items with realistic quantities");
    console.log("• 6 Invoices with different statuses\n");

    console.log(
      "🔗 Test the API endpoints at: http://localhost:3000/api/warehouse"
    );
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    // Close database connection
    await sequelize.close();
  }
}

// Handle uncaught errors
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Run the seeding process
if (require.main === module) {
  runAllSeeds()
    .then(() => {
      console.log("\n✨ Seeding process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Seeding process failed:", error);
      process.exit(1);
    });
}

module.exports = { runAllSeeds };
