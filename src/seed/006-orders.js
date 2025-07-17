module.exports = {
  up: async (queryInterface, Sequelize) => {
    const existingOrders = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM orders;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingOrders[0].count > 0) {
      console.log("Orders already exist, skipping seeding...");
      return;
    }

    await queryInterface.bulkInsert("orders", [
      // TechCorp Solutions orders
      {
        id: "550e8400-e29b-41d4-a716-446655440061",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        number: "PO-TC-2024-001",
        type: "purchase",
        customerId: "550e8400-e29b-41d4-a716-446655440023", // Electronic Components Supply
        warehouseId: "550e8400-e29b-41d4-a716-446655440031", // Main Warehouse
        date: new Date("2024-01-15"),
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440001",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440062",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        number: "PO-TC-2024-002",
        type: "purchase",
        customerId: "550e8400-e29b-41d4-a716-446655440023",
        warehouseId: "550e8400-e29b-41d4-a716-446655440031",
        date: new Date("2024-01-20"),
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440001",
      },
      // Sales orders
      {
        id: "550e8400-e29b-41d4-a716-446655440063",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        number: "SO-TC-2024-001",
        type: "sales",
        customerId: "550e8400-e29b-41d4-a716-446655440021", // ABC Tech Solutions
        warehouseId: "550e8400-e29b-41d4-a716-446655440031",
        date: new Date("2024-02-01"),
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-01"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440001",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440064",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        number: "SO-TC-2024-002",
        type: "sales",
        customerId: "550e8400-e29b-41d4-a716-446655440022", // Digital Dynamics Corp
        warehouseId: "550e8400-e29b-41d4-a716-446655440031",
        date: new Date("2024-02-05"),
        createdAt: new Date("2024-02-05"),
        updatedAt: new Date("2024-02-05"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440001",
      },
      // Transfer order
      {
        id: "550e8400-e29b-41d4-a716-446655440065",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        number: "TO-TC-2024-001",
        type: "transfer",
        customerId: "550e8400-e29b-41d4-a716-446655440021", // Using customer for transfer tracking
        warehouseId: "550e8400-e29b-41d4-a716-446655440032", // East Coast Hub
        date: new Date("2024-02-10"),
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date("2024-02-10"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440002",
      },

      // Global Manufacturing orders
      {
        id: "550e8400-e29b-41d4-a716-446655440066",
        companyId: "550e8400-e29b-41d4-a716-446655440012",
        number: "PO-GM-2024-001",
        type: "purchase",
        customerId: "550e8400-e29b-41d4-a716-446655440026", // Raw Materials International
        warehouseId: "550e8400-e29b-41d4-a716-446655440033", // Production Plant
        date: new Date("2024-01-18"),
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-01-18"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440003",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440067",
        companyId: "550e8400-e29b-41d4-a716-446655440012",
        number: "SO-GM-2024-001",
        type: "sales",
        customerId: "550e8400-e29b-41d4-a716-446655440024", // Industrial Equipment Ltd
        warehouseId: "550e8400-e29b-41d4-a716-446655440033",
        date: new Date("2024-02-03"),
        createdAt: new Date("2024-02-03"),
        updatedAt: new Date("2024-02-03"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440003",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440068",
        companyId: "550e8400-e29b-41d4-a716-446655440012",
        number: "SO-GM-2024-002",
        type: "sales",
        customerId: "550e8400-e29b-41d4-a716-446655440025", // Construction Partners Inc
        warehouseId: "550e8400-e29b-41d4-a716-446655440034", // Storage Facility
        date: new Date("2024-02-08"),
        createdAt: new Date("2024-02-08"),
        updatedAt: new Date("2024-02-08"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440003",
      },

      // Retail Empire orders
      {
        id: "550e8400-e29b-41d4-a716-446655440069",
        companyId: "550e8400-e29b-41d4-a716-446655440013",
        number: "PO-RE-2024-001",
        type: "purchase",
        customerId: "550e8400-e29b-41d4-a716-446655440029", // Product Manufacturing Co
        warehouseId: "550e8400-e29b-41d4-a716-446655440035", // Central Distribution
        date: new Date("2024-01-25"),
        createdAt: new Date("2024-01-25"),
        updatedAt: new Date("2024-01-25"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440005",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440070",
        companyId: "550e8400-e29b-41d4-a716-446655440013",
        number: "SO-RE-2024-001",
        type: "sales",
        customerId: "550e8400-e29b-41d4-a716-446655440027", // Consumer Electronics Chain
        warehouseId: "550e8400-e29b-41d4-a716-446655440035",
        date: new Date("2024-02-12"),
        createdAt: new Date("2024-02-12"),
        updatedAt: new Date("2024-02-12"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440005",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440071",
        companyId: "550e8400-e29b-41d4-a716-446655440013",
        number: "SO-RE-2024-002",
        type: "sales",
        customerId: "550e8400-e29b-41d4-a716-446655440028", // Online Retail Platform
        warehouseId: "550e8400-e29b-41d4-a716-446655440036", // West Coast Fulfillment
        date: new Date("2024-02-15"),
        createdAt: new Date("2024-02-15"),
        updatedAt: new Date("2024-02-15"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440005",
      },
    ]);

    console.log("Orders seeded successfully");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("orders", null, {});
  },
};
