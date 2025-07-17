module.exports = {
  up: async (queryInterface, Sequelize) => {
    const existingCompanies = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM companies;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingCompanies[0].count > 0) {
      console.log("Companies already exist, skipping seeding...");
      return;
    }

    // Create sample companies
    await queryInterface.bulkInsert("companies", [
      {
        id: "550e8400-e29b-41d4-a716-446655440011",
        name: "TechCorp Solutions",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440012",
        name: "Global Manufacturing Inc",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440013",
        name: "Retail Empire Ltd",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: null,
      },
    ]);

    console.log("Companies seeded successfully");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("companies", null, {});
  },
};
