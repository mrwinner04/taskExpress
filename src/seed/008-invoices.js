module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if invoices already exist
    const existingInvoices = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM invoices;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingInvoices[0].count > 0) {
      console.log("Invoices already exist, skipping seeding...");
      return;
    }

    await queryInterface.bulkInsert("invoices", [
      // TechCorp Solutions invoices

      // Invoice for Sales Order SO-TC-2024-001
      {
        id: "550e8400-e29b-41d4-a716-446655440111",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        orderId: "550e8400-e29b-41d4-a716-446655440063",
        number: "INV-TC-2024-001",
        date: new Date("2024-02-01"),
        status: "paid",
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-03"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440001",
      },

      // Invoice for Sales Order SO-TC-2024-002
      {
        id: "550e8400-e29b-41d4-a716-446655440112",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        orderId: "550e8400-e29b-41d4-a716-446655440064",
        number: "INV-TC-2024-002",
        date: new Date("2024-02-05"),
        status: "pending",
        createdAt: new Date("2024-02-05"),
        updatedAt: new Date("2024-02-05"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440001",
      },

      // Global Manufacturing invoices

      // Invoice for Sales Order SO-GM-2024-001
      {
        id: "550e8400-e29b-41d4-a716-446655440113",
        companyId: "550e8400-e29b-41d4-a716-446655440012",
        orderId: "550e8400-e29b-41d4-a716-446655440067",
        number: "INV-GM-2024-001",
        date: new Date("2024-02-03"),
        status: "paid",
        createdAt: new Date("2024-02-03"),
        updatedAt: new Date("2024-02-05"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440003",
      },

      // Invoice for Sales Order SO-GM-2024-002
      {
        id: "550e8400-e29b-41d4-a716-446655440114",
        companyId: "550e8400-e29b-41d4-a716-446655440012",
        orderId: "550e8400-e29b-41d4-a716-446655440068",
        number: "INV-GM-2024-002",
        date: new Date("2024-02-08"),
        status: "pending",
        createdAt: new Date("2024-02-08"),
        updatedAt: new Date("2024-02-08"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440003",
      },

      // Retail Empire invoices

      // Invoice for Sales Order SO-RE-2024-001
      {
        id: "550e8400-e29b-41d4-a716-446655440115",
        companyId: "550e8400-e29b-41d4-a716-446655440013",
        orderId: "550e8400-e29b-41d4-a716-446655440070",
        number: "INV-RE-2024-001",
        date: new Date("2024-02-12"),
        status: "paid",
        createdAt: new Date("2024-02-12"),
        updatedAt: new Date("2024-02-14"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440005",
      },

      // Invoice for Sales Order SO-RE-2024-002
      {
        id: "550e8400-e29b-41d4-a716-446655440116",
        companyId: "550e8400-e29b-41d4-a716-446655440013",
        orderId: "550e8400-e29b-41d4-a716-446655440071",
        number: "INV-RE-2024-002",
        date: new Date("2024-02-15"),
        status: "overdue",
        createdAt: new Date("2024-02-15"),
        updatedAt: new Date("2024-02-15"),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440005",
      },
    ]);

    console.log("Invoices seeded successfully");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("invoices", null, {});
  },
};
