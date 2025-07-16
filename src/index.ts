import express, { Request, Response, Application } from "express";
import mainRouter from "./routes/mainRoutes";
import { testConnection } from "./config/database";

const app: Application = express();

const PORT: number = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", mainRouter);

// Root endpoint with comprehensive API documentation
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "TaskExpress API - Warehouse Management System",
    version: "2.0.0",
    description:
      "Complete warehouse management system with modular architecture",
    endpoints: {
      analytics: {
        "best-selling-products": "GET /api/analytics/best-selling-products",
        "customers-most-orders": "GET /api/analytics/customers-most-orders",
        "highest-stock-products": "GET /api/analytics/highest-stock-products",
        dashboard: "GET /api/analytics/dashboard",
      },
      companies: {
        list: "GET /api/companies",
        create: "POST /api/companies",
        get: "GET /api/companies/:id",
        update: "PUT /api/companies/:id",
        delete: "DELETE /api/companies/:id",
      },
      customers: {
        list: "GET /api/customers/company/:companyId",
        create: "POST /api/customers",
        get: "GET /api/customers/:id",
        update: "PUT /api/customers/:id",
        delete: "DELETE /api/customers/:id",
      },
      invoices: {
        list: "GET /api/invoices/company/:companyId",
        byStatus: "GET /api/invoices/company/:companyId/status/:status",
        create: "POST /api/invoices",
        get: "GET /api/invoices/:id",
        update: "PUT /api/invoices/:id",
        delete: "DELETE /api/invoices/:id",
      },
      orders: {
        list: "GET /api/orders/company/:companyId",
        byType: "GET /api/orders/company/:companyId/type/:type",
        byCustomer: "GET /api/orders/customer/:customerId",
        create: "POST /api/orders",
        get: "GET /api/orders/:id",
        update: "PUT /api/orders/:id",
        delete: "DELETE /api/orders/:id",
      },
      products: {
        list: "GET /api/products/company/:companyId",
        byType: "GET /api/products/company/:companyId/type/:type",
        search: "GET /api/products/company/:companyId/search?searchTerm=term",
        create: "POST /api/products",
        get: "GET /api/products/:id",
        update: "PUT /api/products/:id",
        delete: "DELETE /api/products/:id",
      },
      users: {
        list: "GET /api/users/company/:companyId",
        byEmail: "GET /api/users/email/:email",
        create: "POST /api/users",
        get: "GET /api/users/:id",
        update: "PUT /api/users/:id",
        delete: "DELETE /api/users/:id",
      },
      warehouses: {
        list: "GET /api/warehouses/company/:companyId",
        byType: "GET /api/warehouses/company/:companyId/type/:type",
        search: "GET /api/warehouses/company/:companyId/search?searchTerm=term",
        create: "POST /api/warehouses",
        get: "GET /api/warehouses/:id",
        update: "PUT /api/warehouses/:id",
        delete: "DELETE /api/warehouses/:id",
      },
      utilities: {
        health: "GET /api/health",
        "data-overview": "GET /api/data-overview",
      },
    },
    architecture: {
      pattern: "Modular Folder Structure",
      modules: [
        "Customer",
        "Invoices",
        "Orders",
        "Products",
        "User",
        "Warehouse",
      ],
    },
  });
});

const startServer = async (): Promise<void> => {
  try {
    await testConnection();

    app.listen(PORT, (): void => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Local: http://localhost:${PORT}`);
      console.log(`🌟 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`📊 API Documentation: http://localhost:${PORT}`);
      console.log(`🔧 New Modular Architecture: Active`);
      console.log(
        `📁 Modules: Customer, Invoices, Orders, Products, User, Warehouse`
      );
    });
  } catch (error) {
    console.error("💥 Failed to start server:", error);
    process.exit(1);
  }
};

// Start the application
startServer();

export default app;
