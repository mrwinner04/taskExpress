"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if customers already exist
    const existingCustomers = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM customers;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingCustomers[0].count > 0) {
      console.log("Customers already exist, skipping seeding...");
      return;
    }

    // Create sample customers and suppliers for each company
    await queryInterface.bulkInsert("customers", [
      // TechCorp Solutions customers
      {
        id: "550e8400-e29b-41d4-a716-446655440021",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        type: "customer",
        name: "ABC Tech Solutions",
        email: "procurement@abctech.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440001",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440022",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        type: "customer",
        name: "Digital Dynamics Corp",
        email: "orders@digitaldynamics.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440001",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440023",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        type: "supplier",
        name: "Electronic Components Supply",
        email: "sales@ecsupply.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440001",
      },
      // Global Manufacturing customers
      {
        id: "550e8400-e29b-41d4-a716-446655440024",
        companyId: "550e8400-e29b-41d4-a716-446655440012",
        type: "customer",
        name: "Industrial Equipment Ltd",
        email: "purchasing@indequip.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440003",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440025",
        companyId: "550e8400-e29b-41d4-a716-446655440012",
        type: "customer",
        name: "Construction Partners Inc",
        email: "orders@constructpartners.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440003",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440026",
        companyId: "550e8400-e29b-41d4-a716-446655440012",
        type: "supplier",
        name: "Raw Materials International",
        email: "supply@rawmaterials.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440003",
      },
      // Retail Empire customers
      {
        id: "550e8400-e29b-41d4-a716-446655440027",
        companyId: "550e8400-e29b-41d4-a716-446655440013",
        type: "customer",
        name: "Consumer Electronics Chain",
        email: "wholesale@cechain.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440005",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440028",
        companyId: "550e8400-e29b-41d4-a716-446655440013",
        type: "customer",
        name: "Online Retail Platform",
        email: "vendor@onlineretail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440005",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440029",
        companyId: "550e8400-e29b-41d4-a716-446655440013",
        type: "supplier",
        name: "Product Manufacturing Co",
        email: "wholesale@productmanuf.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440005",
      },
    ]);

    console.log("Customers seeded successfully");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("customers", null, {});
  },
};
