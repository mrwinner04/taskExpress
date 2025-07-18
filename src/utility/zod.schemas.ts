import { z } from "zod";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const uuidSchema = z.string().regex(uuidRegex, "Invalid UUID format");

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const createOrderItemSchema = z.object({
  orderId: z.string().regex(uuidRegex, "Invalid order ID format"),
  productId: z.string().regex(uuidRegex, "Invalid product ID format"),
  quantity: z.coerce
    .number()
    .int()
    .positive("Quantity must be a positive integer"),
  price: z.coerce.number().positive("Price must be positive"),
  modifiedBy: z.string().optional(),
});

export const updateOrderItemSchema = z.object({
  productId: z
    .string()
    .regex(uuidRegex, "Invalid product ID format")
    .optional(),
  quantity: z.coerce
    .number()
    .int()
    .positive("Quantity must be a positive integer")
    .optional(),
  price: z.coerce.number().positive("Price must be positive").optional(),
  modifiedBy: z.string().optional(),
});

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name too long"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  type: z.enum(["solid", "liquid"], {
    message: "Type must be solid or liquid",
  }),
  warehouseId: z.string().regex(uuidRegex, "Invalid warehouse ID format"),
});

export const createOrderSchema = z.object({
  companyId: z.string().regex(uuidRegex, "Invalid company ID format"),
  type: z.enum(["sales", "purchase", "transfer"], {
    message: "Type must be sales, purchase, or transfer",
  }),
  customerId: z.string().regex(uuidRegex, "Invalid customer ID format"),
  warehouseId: z.string().regex(uuidRegex, "Invalid warehouse ID format"),
  date: z.string().datetime("Invalid date format").or(z.date()).optional(),
  totalAmount: z.coerce
    .number()
    .positive("Total amount must be positive")
    .optional(),
});

export const updateOrderSchema = z.object({
  type: z
    .enum(["sales", "purchase", "transfer"], {
      message: "Type must be sales, purchase, or transfer",
    })
    .optional(),
  customerId: z
    .string()
    .regex(uuidRegex, "Invalid customer ID format")
    .optional(),
  warehouseId: z
    .string()
    .regex(uuidRegex, "Invalid warehouse ID format")
    .optional(),
  totalAmount: z.coerce
    .number()
    .positive("Total amount must be positive")
    .optional(),
});

export const createWarehouseSchema = z.object({
  companyId: z.string().regex(uuidRegex, "Invalid company ID format"),
  name: z
    .string()
    .min(1, "Warehouse name is required")
    .max(100, "Warehouse name too long"),
  type: z.enum(["solid", "liquid"], {
    message: "Type must be solid or liquid",
  }),
  address: z.string().optional(),
});

export const updateWarehouseSchema = z.object({
  name: z
    .string()
    .min(1, "Warehouse name is required")
    .max(100, "Warehouse name too long")
    .optional(),
  type: z
    .enum(["solid", "liquid"], { message: "Type must be solid or liquid" })
    .optional(),
  address: z.string().optional(),
});

export const createCustomerSchema = z.object({
  companyId: z.string().regex(uuidRegex, "Invalid company ID format"),
  type: z.enum(["customer", "supplier"], {
    message: "Type must be customer or supplier",
  }),
  name: z
    .string()
    .min(1, "Customer name is required")
    .max(100, "Customer name too long"),
});

export const updateCustomerSchema = z.object({
  type: z
    .enum(["customer", "supplier"], {
      message: "Type must be customer or supplier",
    })
    .optional(),
  name: z
    .string()
    .min(1, "Customer name is required")
    .max(100, "Customer name too long")
    .optional(),
});

export const createCompanySchema = z.object({
  name: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name too long"),
  modifiedBy: z.string().optional(),
});

export const updateCompanySchema = z.object({
  name: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name too long")
    .optional(),
  modifiedBy: z.string().optional(),
});

export const createInvoiceSchema = z.object({
  companyId: z.string().regex(uuidRegex, "Invalid company ID format"),
  orderId: z.string().regex(uuidRegex, "Invalid order ID format"),
  date: z.string().datetime("Invalid date format").or(z.date()),
  status: z
    .enum(["pending", "paid", "overdue", "cancelled"], {
      message: "Invalid invoice status",
    })
    .optional(),
});

export const updateInvoiceSchema = z.object({
  date: z.string().datetime("Invalid date format").or(z.date()).optional(),
  status: z
    .enum(["pending", "paid", "overdue", "cancelled"], {
      message: "Invalid invoice status",
    })
    .optional(),
});

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),
  email: z.string().email("Invalid email format"),
  companyId: z.string().regex(uuidRegex, "Invalid company ID format"),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long")
    .optional(),
  email: z.string().email("Invalid email format").optional(),
});

export const validateRequest = (
  schema: z.ZodSchema,
  target: "body" | "query" | "params" = "body"
) => {
  return (req: any, res: any, next: any) => {
    try {
      const data = req[target];
      const validatedData = schema.parse(data);

      if (target !== "query") {
        req[target] = validatedData;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
