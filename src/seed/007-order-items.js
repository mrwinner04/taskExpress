module.exports = {
  up: async (queryInterface, Sequelize) => {
    const existingOrderItems = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM order_items;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingOrderItems[0].count > 0) {
      console.log("Order items already exist, skipping seeding...");
      return;
    }

    await queryInterface.bulkInsert("order_items", [
      // TechCorp Solutions order items

      // Purchase Order PO-TC-2024-001
      {
        id: "550e8400-e29b-41d4-a716-446655440081",
        orderId: "550e8400-e29b-41d4-a716-446655440061",
        productId: "550e8400-e29b-41d4-a716-446655440041", // Server Rack
        quantity: 25,
        price: 2999.99,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        deletedAt: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440082",
        orderId: "550e8400-e29b-41d4-a716-446655440061",
        productId: "550e8400-e29b-41d4-a716-446655440042", // Network Switch
        quantity: 50,
        price: 899.99,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        deletedAt: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440083",
        orderId: "550e8400-e29b-41d4-a716-446655440061",
        productId: "550e8400-e29b-41d4-a716-446655440043", // Thermal Paste
        quantity: 200,
        price: 29.99,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        deletedAt: null,
      },
    ]);

    // Purchase Order PO-TC-2024-002
    await queryInterface.bulkInsert("order_items", [
      {
        id: "550e8400-e29b-41d4-a716-446655440084",
        orderId: "550e8400-e29b-41d4-a716-446655440062",
        productId: "550e8400-e29b-41d4-a716-446655440044", // Storage Array
        quantity: 15,
        price: 4999.99,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
        deletedAt: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440085",
        orderId: "550e8400-e29b-41d4-a716-446655440062",
        productId: "550e8400-e29b-41d4-a716-446655440042", // Network Switch (additional)
        quantity: 30,
        price: 899.99,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
        deletedAt: null,
      },
    ]);

    // Global Manufacturing Purchase Order PO-GM-2024-001
    await queryInterface.bulkInsert("order_items", [
      {
        id: "550e8400-e29b-41d4-a716-446655440086",
        orderId: "550e8400-e29b-41d4-a716-446655440063",
        productId: "550e8400-e29b-41d4-a716-446655440042",
        quantity: 15,
        price: 899.99,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-01"),
        deletedAt: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440087",
        orderId: "550e8400-e29b-41d4-a716-446655440063",
        productId: "550e8400-e29b-41d4-a716-446655440041", // Server Rack
        quantity: 5,
        price: 2999.99,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-01"),
        deletedAt: null,
      },

      // Sales Order SO-TC-2024-002
      {
        id: "550e8400-e29b-41d4-a716-446655440088",
        orderId: "550e8400-e29b-41d4-a716-446655440064",
        productId: "550e8400-e29b-41d4-a716-446655440044", // Storage Array
        quantity: 3,
        price: 4999.99,
        createdAt: new Date("2024-02-05"),
        updatedAt: new Date("2024-02-05"),
        deletedAt: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440089",
        orderId: "550e8400-e29b-41d4-a716-446655440064",
        productId: "550e8400-e29b-41d4-a716-446655440043", // Thermal Paste
        quantity: 50,
        price: 29.99,
        createdAt: new Date("2024-02-05"),
        updatedAt: new Date("2024-02-05"),
        deletedAt: null,
      },

      // Transfer Order TO-TC-2024-001
      {
        id: "550e8400-e29b-41d4-a716-446655440090",
        orderId: "550e8400-e29b-41d4-a716-446655440065",
        productId: "550e8400-e29b-41d4-a716-446655440042", // Network Switch
        quantity: 10,
        price: 899.99,
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date("2024-02-10"),
        deletedAt: null,
      },

      // Global Manufacturing order items

      // Purchase Order PO-GM-2024-001
      {
        id: "550e8400-e29b-41d4-a716-446655440091",
        orderId: "550e8400-e29b-41d4-a716-446655440066",
        productId: "550e8400-e29b-41d4-a716-446655440045", // Steel Beam
        quantity: 100,
        price: 199.99,
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-01-18"),
        deletedAt: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440092",
        orderId: "550e8400-e29b-41d4-a716-446655440066",
        productId: "550e8400-e29b-41d4-a716-446655440046", // Motor Assembly
        quantity: 20,
        price: 8999.99,
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-01-18"),
        deletedAt: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440093",
        orderId: "550e8400-e29b-41d4-a716-446655440066",
        productId: "550e8400-e29b-41d4-a716-446655440047", // Hydraulic Fluid
        quantity: 50,
        price: 299.99,
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-01-18"),
        deletedAt: null,
      },

      // Sales Order SO-GM-2024-001 (High-value customer)
      {
        id: "550e8400-e29b-41d4-a716-446655440094",
        orderId: "550e8400-e29b-41d4-a716-446655440067",
        productId: "550e8400-e29b-41d4-a716-446655440045", // Steel Beam
        quantity: 75,
        price: 199.99,
        createdAt: new Date("2024-02-03"),
        updatedAt: new Date("2024-02-03"),
        deletedAt: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440095",
        orderId: "550e8400-e29b-41d4-a716-446655440067",
        productId: "550e8400-e29b-41d4-a716-446655440048", // Gear Set
        quantity: 5,
        price: 1899.99,
        createdAt: new Date("2024-02-03"),
        updatedAt: new Date("2024-02-03"),
        deletedAt: null,
      },

      // Sales Order SO-GM-2024-002
      {
        id: "550e8400-e29b-41d4-a716-446655440096",
        orderId: "550e8400-e29b-41d4-a716-446655440068",
        productId: "550e8400-e29b-41d4-a716-446655440046", // Motor Assembly (popular)
        quantity: 8,
        price: 8999.99,
        createdAt: new Date("2024-02-08"),
        updatedAt: new Date("2024-02-08"),
        deletedAt: null,
      },

      // Retail Empire order items

      // Purchase Order PO-RE-2024-001
      {
        id: "550e8400-e29b-41d4-a716-446655440097",
        orderId: "550e8400-e29b-41d4-a716-446655440069",
        productId: "550e8400-e29b-41d4-a716-446655440049", // Bluetooth Headphones
        quantity: 500,
        price: 149.99,
        createdAt: new Date("2024-01-25"),
        updatedAt: new Date("2024-01-25"),
        deletedAt: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440098",
        orderId: "550e8400-e29b-41d4-a716-446655440069",
        productId: "550e8400-e29b-41d4-a716-446655440050", // Security Camera
        quantity: 200,
        price: 299.99,
        createdAt: new Date("2024-01-25"),
        updatedAt: new Date("2024-01-25"),
        deletedAt: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440099",
        orderId: "550e8400-e29b-41d4-a716-446655440069",
        productId: "550e8400-e29b-41d4-a716-446655440052", // Gaming Keyboard
        quantity: 300,
        price: 199.99,
        createdAt: new Date("2024-01-25"),
        updatedAt: new Date("2024-01-25"),
        deletedAt: null,
      },

      // Sales Order SO-RE-2024-001 (Best-selling consumer items)
      {
        id: "550e8400-e29b-41d4-a716-446655440100",
        orderId: "550e8400-e29b-41d4-a716-446655440070",
        productId: "550e8400-e29b-41d4-a716-446655440049", // Bluetooth Headphones (best seller)
        quantity: 150,
        price: 149.99,
        createdAt: new Date("2024-02-12"),
        updatedAt: new Date("2024-02-12"),
        deletedAt: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440101",
        orderId: "550e8400-e29b-41d4-a716-446655440070",
        productId: "550e8400-e29b-41d4-a716-446655440052", // Gaming Keyboard
        quantity: 100,
        price: 199.99,
        createdAt: new Date("2024-02-12"),
        updatedAt: new Date("2024-02-12"),
        deletedAt: null,
      },

      // Sales Order SO-RE-2024-002
      {
        id: "550e8400-e29b-41d4-a716-446655440102",
        orderId: "550e8400-e29b-41d4-a716-446655440071",
        productId: "550e8400-e29b-41d4-a716-446655440050", // Security Camera
        quantity: 75,
        price: 299.99,
        createdAt: new Date("2024-02-15"),
        updatedAt: new Date("2024-02-15"),
        deletedAt: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440103",
        orderId: "550e8400-e29b-41d4-a716-446655440071",
        productId: "550e8400-e29b-41d4-a716-446655440051", // Screen Cleaning Solution
        quantity: 200,
        price: 12.99,
        createdAt: new Date("2024-02-15"),
        updatedAt: new Date("2024-02-15"),
        deletedAt: null,
      },
    ]);

    console.log("Order items seeded successfully");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("order_items", null, {});
  },
};
