module.exports = {
  up: async (queryInterface, Sequelize) => {
    const existingWarehouses = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM warehouses;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingWarehouses[0].count > 0) {
      console.log("Warehouses already exist, skipping seeding...");
      return;
    }

    await queryInterface.bulkInsert("warehouses", [
      // TechCorp Solutions warehouses
      {
        id: "550e8400-e29b-41d4-a716-446655440031",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        type: "solid",
        name: "TechCorp Main Warehouse",
        address: "123 Technology Boulevard, Silicon Valley, CA 94025",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440001",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440032",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        type: "liquid",
        name: "TechCorp East Coast Hub",
        address: "456 Innovation Drive, Boston, MA 02101",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440001",
      },
      // Global Manufacturing warehouses
      {
        id: "550e8400-e29b-41d4-a716-446655440033",
        companyId: "550e8400-e29b-41d4-a716-446655440012",
        type: "solid",
        name: "Global Manufacturing Plant A",
        address: "789 Industrial Parkway, Detroit, MI 48201",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440003",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440034",
        companyId: "550e8400-e29b-41d4-a716-446655440012",
        type: "liquid",
        name: "Global Manufacturing Storage Facility",
        address: "321 Storage Lane, Chicago, IL 60601",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440003",
      },
      // Retail Empire warehouses
      {
        id: "550e8400-e29b-41d4-a716-446655440035",
        companyId: "550e8400-e29b-41d4-a716-446655440013",
        type: "solid",
        name: "Retail Empire Central Distribution",
        address: "654 Commerce Center, Dallas, TX 75201",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440005",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440036",
        companyId: "550e8400-e29b-41d4-a716-446655440013",
        type: "liquid",
        name: "Retail Empire West Coast Fulfillment",
        address: "987 Logistics Avenue, Los Angeles, CA 90210",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440005",
      },
    ]);

    console.log("Warehouses seeded successfully");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("warehouses", null, {});
  },
};
