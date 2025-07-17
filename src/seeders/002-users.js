module.exports = {
  up: async (queryInterface, Sequelize) => {
    const existingUsers = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM users;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingUsers[0].count > 0) {
      console.log("Users already exist, skipping seeding...");
      return;
    }

    await queryInterface.bulkInsert("users", [
      // TechCorp Solutions users
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        email: "admin@techcorp.com",
        name: "John Administrator",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        email: "warehouse@techcorp.com",
        name: "Sarah Warehouse Manager",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      // Global Manufacturing users
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        companyId: "550e8400-e29b-41d4-a716-446655440012",
        email: "manager@globalmanuf.com",
        name: "Mike Production Manager",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440004",
        companyId: "550e8400-e29b-41d4-a716-446655440012",
        email: "sales@globalmanuf.com",
        name: "Lisa Sales Director",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      // Retail Empire users
      {
        id: "550e8400-e29b-41d4-a716-446655440005",
        companyId: "550e8400-e29b-41d4-a716-446655440013",
        email: "ceo@retailempire.com",
        name: "David CEO",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440006",
        companyId: "550e8400-e29b-41d4-a716-446655440013",
        email: "inventory@retailempire.com",
        name: "Emma Inventory Specialist",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);

    console.log("Users seeded successfully");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
