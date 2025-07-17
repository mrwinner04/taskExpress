"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Function to set timestamps automatically
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION set_timestamps()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = CURRENT_TIMESTAMP;
        IF TG_OP = 'INSERT' THEN
          NEW."createdAt" = CURRENT_TIMESTAMP;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Function to prevent ordering deleted products
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION prevent_ordering_deleted_products()
      RETURNS TRIGGER AS $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM products 
          WHERE id = NEW."productId" 
          AND "deletedAt" IS NOT NULL
        ) THEN
          RAISE EXCEPTION 'Cannot order deleted products';
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Function to prevent negative stock
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION prevent_negative_stock()
      RETURNS TRIGGER AS $$
      DECLARE
        current_stock INTEGER;
        stock_change INTEGER;
        order_type_val VARCHAR;
      BEGIN
        -- Get the order type to determine if this increases or decreases stock
        SELECT type INTO order_type_val 
        FROM orders 
        WHERE id = NEW."orderId";
        
        -- Calculate stock change based on order type
        IF order_type_val = 'purchase' THEN
          stock_change = NEW.quantity; -- Purchase increases stock
        ELSIF order_type_val IN ('sales', 'transfer') THEN
          stock_change = -NEW.quantity; -- Sales/transfer decreases stock
        ELSE
          stock_change = 0;
        END IF;
        
        -- Check if we have enough stock for sales/transfer
        IF stock_change < 0 THEN
          SELECT COALESCE(
            (SELECT SUM(
              CASE 
                WHEN o.type = 'purchase' THEN oi.quantity
                WHEN o.type IN ('sales', 'transfer') THEN -oi.quantity
                ELSE 0
              END
            )
            FROM order_items oi
            JOIN orders o ON oi."orderId" = o.id
            WHERE oi."productId" = NEW."productId"
            AND oi."deletedAt" IS NULL
            AND o."deletedAt" IS NULL), 0
          ) INTO current_stock;
          
          IF current_stock + stock_change < 0 THEN
            RAISE EXCEPTION 'Insufficient stock. Current stock: %, Requested: %', current_stock, ABS(stock_change);
          END IF;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Function to generate order numbers automatically
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION generate_order_number()
      RETURNS TRIGGER AS $$
      DECLARE
        order_count INTEGER;
        year_suffix VARCHAR(2);
      BEGIN
        -- Get current year last 2 digits
        year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
        
        -- Count existing orders for this company this year
        SELECT COUNT(*) + 1 INTO order_count
        FROM orders 
        WHERE "companyId" = NEW."companyId"
        AND EXTRACT(YEAR FROM "createdAt") = EXTRACT(YEAR FROM CURRENT_DATE);
        
        -- Generate order number: ORD-YY-000001
        NEW.number := 'ORD-' || year_suffix || '-' || LPAD(order_count::TEXT, 6, '0');
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Function to create invoice automatically when order is created
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION create_invoice_on_order()
      RETURNS TRIGGER AS $$
      DECLARE
        invoice_count INTEGER;
        year_suffix VARCHAR(2);
        invoice_number VARCHAR;
      BEGIN
        -- Only create invoice for sales orders
        IF NEW.type = 'sales' THEN
          -- Get current year last 2 digits
          year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
          
          -- Count existing invoices for this company this year
          SELECT COUNT(*) + 1 INTO invoice_count
          FROM invoices 
          WHERE "companyId" = NEW."companyId"
          AND EXTRACT(YEAR FROM "createdAt") = EXTRACT(YEAR FROM CURRENT_DATE);
          
          -- Generate invoice number: INV-YY-000001
          invoice_number := 'INV-' || year_suffix || '-' || LPAD(invoice_count::TEXT, 6, '0');
          
          -- Insert the invoice
          INSERT INTO invoices (
            "companyId", 
            "orderId", 
            "number", 
            "date", 
            "status",
            "createdAt",
            "updatedAt"
          ) VALUES (
            NEW."companyId",
            NEW.id,
            invoice_number,
            NEW.date,
            'pending',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          );
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "DROP FUNCTION IF EXISTS set_timestamps() CASCADE;"
    );
    await queryInterface.sequelize.query(
      "DROP FUNCTION IF EXISTS prevent_ordering_deleted_products() CASCADE;"
    );
    await queryInterface.sequelize.query(
      "DROP FUNCTION IF EXISTS prevent_negative_stock() CASCADE;"
    );
    await queryInterface.sequelize.query(
      "DROP FUNCTION IF EXISTS generate_order_number() CASCADE;"
    );
    await queryInterface.sequelize.query(
      "DROP FUNCTION IF EXISTS create_invoice_on_order() CASCADE;"
    );
  },
};
