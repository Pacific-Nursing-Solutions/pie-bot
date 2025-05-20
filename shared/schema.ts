import { pgTable, text, serial, integer, boolean, timestamp, numeric, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users - Basic user model for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

// Companies - Company information
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  entityType: text("entity_type").notNull(),
  founded: timestamp("founded").notNull(),
  valuation: numeric("valuation"),
  authorizedShares: integer("authorized_shares").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCompanySchema = createInsertSchema(companies).pick({
  name: true,
  entityType: true,
  founded: true,
  valuation: true,
  authorizedShares: true,
  userId: true,
});

// Stakeholders - Equity holders (founders, investors, etc.)
export const stakeholders = pgTable("stakeholders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  equityType: text("equity_type").notNull(),
  ownershipPercentage: numeric("ownership_percentage").notNull(),
  shares: integer("shares").notNull(),
  vestingSchedule: text("vesting_schedule"),
  companyId: integer("company_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStakeholderSchema = createInsertSchema(stakeholders).pick({
  name: true,
  email: true,
  role: true,
  equityType: true,
  ownershipPercentage: true,
  shares: true,
  vestingSchedule: true,
  companyId: true,
});

// FinancialData - Company financial information
export const financialData = pgTable("financial_data", {
  id: serial("id").primaryKey(),
  cashBalance: numeric("cash_balance").notNull(),
  burnRate: numeric("burn_rate").notNull(),
  revenue: numeric("revenue"),
  expenses: numeric("expenses"),
  companyId: integer("company_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFinancialDataSchema = createInsertSchema(financialData).pick({
  cashBalance: true,
  burnRate: true,
  revenue: true,
  expenses: true,
  companyId: true,
});

// TokenInfo - Blockchain token information
export const tokenInfo = pgTable("token_info", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  contractAddress: text("contract_address").notNull(),
  totalSupply: integer("total_supply").notNull(),
  network: text("network").notNull(),
  companyId: integer("company_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTokenInfoSchema = createInsertSchema(tokenInfo).pick({
  name: true,
  symbol: true,
  contractAddress: true,
  totalSupply: true,
  network: true,
  companyId: true,
});

// TokenTransfers - Record of token transfers
export const tokenTransfers = pgTable("token_transfers", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  from: text("from_address").notNull(),
  to: text("to_address").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  tokenId: integer("token_id").notNull(),
});

export const insertTokenTransferSchema = createInsertSchema(tokenTransfers).pick({
  amount: true,
  from: true,
  to: true,
  tokenId: true,
});

// Documents - Generated legal documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(),
  companyId: integer("company_id").notNull(),
  stakeholderId: integer("stakeholder_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  signed: boolean("signed").default(false),
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  title: true,
  content: true,
  type: true,
  companyId: true,
  stakeholderId: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type InsertStakeholder = z.infer<typeof insertStakeholderSchema>;
export type Stakeholder = typeof stakeholders.$inferSelect;

export type InsertFinancialData = z.infer<typeof insertFinancialDataSchema>;
export type FinancialData = typeof financialData.$inferSelect;

export type InsertTokenInfo = z.infer<typeof insertTokenInfoSchema>;
export type TokenInfo = typeof tokenInfo.$inferSelect;

export type InsertTokenTransfer = z.infer<typeof insertTokenTransferSchema>;
export type TokenTransfer = typeof tokenTransfers.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
