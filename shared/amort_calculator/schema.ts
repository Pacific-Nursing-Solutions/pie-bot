import { pgTable, text, serial, integer, boolean, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Loan calculation schemas
export const loanInputSchema = z.object({
  loanAmount: z.union([
    z.string().transform((val) => {
      const num = parseFloat(val.replace(/[^\d.-]/g, ''));
      return isNaN(num) ? 0 : num;
    }),
    z.number()
  ]).pipe(z.number().min(1, "Loan amount must be greater than 0")),
  interestRate: z.union([
    z.string().transform((val) => {
      const num = parseFloat(val.replace(/[^\d.-]/g, ''));
      return isNaN(num) ? 0 : num;
    }),
    z.number()
  ]).pipe(z.number().min(0, "Interest rate must be non-negative").max(100, "Interest rate cannot exceed 100%")),
  loanTerm: z.union([
    z.string().transform((val) => {
      const num = parseFloat(val.replace(/[^\d.-]/g, ''));
      return isNaN(num) ? 0 : num;
    }),
    z.number()
  ]).pipe(z.number().min(1, "Loan term must be at least 1")),
  termUnit: z.union([z.string(), z.enum(["years", "months"])]).pipe(z.enum(["years", "months"])),
  startDate: z.string(),
  compoundingFreq: z.enum(["annually", "monthly", "daily"]),
  paymentFreq: z.enum(["monthly", "bi-weekly", "weekly"]),
  latePenalty: z.number().min(0).optional(),
  defaultRate: z.number().min(0).optional(),
});

export const paymentEntrySchema = z.object({
  paymentNumber: z.number(),
  date: z.string(),
  paymentAmount: z.number(),
  principalAmount: z.number(),
  interestAmount: z.number(),
  remainingBalance: z.number(),
});

export const extraPaymentSchema = z.object({
  amount: z.number().min(0.01, "Extra payment must be greater than 0"),
  paymentDate: z.string(),
  paymentNumber: z.number().optional(),
});

// Collateral schemas
export const collateralSchema = z.object({
  type: z.enum(["unsecured", "real_estate", "vehicle", "personal_property", "other"]),
  // Real Estate fields
  propertyAddress: z.string().optional(),
  legalDescription: z.string().optional(),
  propertyType: z.enum(["residential", "commercial", "land", "other"]).optional(),
  apn: z.string().optional(), // Assessor's Parcel Number
  // Vehicle fields
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleYear: z.string().optional(),
  vin: z.string().optional(),
  plateNumber: z.string().optional(),
  // Personal Property fields
  personalPropertyDescription: z.string().optional(),
  estimatedValue: z.number().optional(),
  // Other/Custom
  customDescription: z.string().optional(),
});

export type LoanInput = z.infer<typeof loanInputSchema>;
export type PaymentEntry = z.infer<typeof paymentEntrySchema>;
export type ExtraPayment = z.infer<typeof extraPaymentSchema>;
export type CollateralInfo = z.infer<typeof collateralSchema>;

// User authentication and profiles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Saved loan calculations
export const savedCalculations = pgTable("saved_calculations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  loanData: text("loan_data").notNull(), // JSON string
  schedule: text("schedule").notNull(), // JSON string
  extraPayments: text("extra_payments").notNull(), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
});

export const insertCalculationSchema = createInsertSchema(savedCalculations).pick({
  userId: true,
  name: true,
  loanData: true,
  schedule: true,
  extraPayments: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SavedCalculation = typeof savedCalculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
