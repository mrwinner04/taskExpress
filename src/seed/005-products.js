module.exports = {
  up: async (queryInterface, Sequelize) => {
    const existingProducts = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM products;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingProducts[0].count > 0) {
      console.log("Products already exist, skipping seeding...");
      return;
    }

    await queryInterface.bulkInsert("products", [
      // TechCorp Solutions products
      {
        id: "550e8400-e29b-41d4-a716-446655440041",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        name: "High-Performance Server Rack",
        code: "TC-SVR-001",
        price: 2999.99,
        type: "solid",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440001",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440042",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        name: "Network Switch 48-Port",
        code: "TC-NSW-048",
        price: 899.99,
        type: "solid",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440001",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440043",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        name: "Thermal Cooling Paste",
        code: "TC-TCP-500",
        price: 29.99,
        type: "liquid",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440001",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440044",
        companyId: "550e8400-e29b-41d4-a716-446655440011",
        name: "Enterprise Storage Array",
        code: "TC-ESA-10TB",
        price: 4999.99,
        type: "solid",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440001",
      },
      // Global Manufacturing products
      {
        id: "550e8400-e29b-41d4-a716-446655440045",
        companyId: "550e8400-e29b-41d4-a716-446655440012",
        name: "Industrial Steel Beam",
        code: "GM-ISB-20FT",
        price: 199.99,
        type: "solid",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440003",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440046",
        companyId: "550e8400-e29b-41d4-a716-446655440012",
        name: "Heavy Duty Motor Assembly",
        code: "GM-HDM-500HP",
        price: 8999.99,
        type: "solid",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440003",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440047",
        companyId: "550e8400-e29b-41d4-a716-446655440012",
        name: "Industrial Hydraulic Fluid",
        code: "GM-IHF-55GAL",
        price: 299.99,
        type: "liquid",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440003",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440048",
        companyId: "550e8400-e29b-41d4-a716-446655440012",
        name: "Precision Machined Gear Set",
        code: "GM-PMG-HEAVY",
        price: 1899.99,
        type: "solid",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440003",
      },
      // Retail Empire products
      {
        id: "550e8400-e29b-41d4-a716-446655440049",
        companyId: "550e8400-e29b-41d4-a716-446655440013",
        name: "Wireless Bluetooth Headphones",
        code: "RE-WBH-PRO",
        price: 149.99,
        type: "solid",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440005",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440050",
        companyId: "550e8400-e29b-41d4-a716-446655440013",
        name: "Smart Home Security Camera",
        code: "RE-SHSC-4K",
        price: 299.99,
        type: "solid",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440005",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440051",
        companyId: "550e8400-e29b-41d4-a716-446655440013",
        name: "Screen Cleaning Solution",
        code: "RE-SCS-16OZ",
        price: 12.99,
        type: "liquid",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440005",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440052",
        companyId: "550e8400-e29b-41d4-a716-446655440013",
        name: "Gaming Mechanical Keyboard",
        code: "RE-GMK-RGB",
        price: 199.99,
        type: "solid",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        modifiedBy: "550e8400-e29b-41d4-a716-446655440005",
      },
    ]);

    console.log("Products seeded successfully");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("products", null, {});
  },
};
