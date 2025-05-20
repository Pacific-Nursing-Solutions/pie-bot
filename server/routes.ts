import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

// Add userId to session
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// Helper function to handle Zod validation errors
function handleZodError(error: unknown) {
  if (error instanceof z.ZodError) {
    return { message: fromZodError(error).message };
  }
  console.error("Server error:", error);
  return { message: "Internal server error" };
}

import {
  insertCompanySchema,
  insertStakeholderSchema,
  insertFinancialDataSchema,
  insertTokenInfoSchema,
  insertTokenTransferSchema,
  insertDocumentSchema,
  insertUserSchema,
} from "@shared/schema";
import { generatePDF } from "./utils/pdfGenerator";
import { signDocument } from "./utils/docusign";
import { calculateValuation } from "./utils/valuationCalculator";
import { generateEquityAgreement } from "./utils/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // AUTH ROUTES
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = z.object({
        username: z.string(),
        password: z.string(),
      }).parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Set user in session (simple authentication)
      if (req.session) {
        req.session.userId = user.id;
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      return res.json(userWithoutPassword);
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  // USER ROUTES
  app.get("/api/user/me", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(req.session.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return res.json(userWithoutPassword);
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  app.post("/api/user/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err: any) => {
        if (err) {
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.json({ message: "Logged out successfully" });
      });
    } else {
      res.json({ message: "Logged out successfully" });
    }
  });

  // COMPANY ROUTES
  app.post("/api/companies", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const companyData = insertCompanySchema.parse({
        ...req.body,
        userId: req.session.userId
      });
      
      const company = await storage.createCompany(companyData);
      return res.status(201).json(company);
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  app.get("/api/companies", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const companies = await storage.getCompaniesByUserId(req.session.userId);
      return res.json(companies);
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const companyId = parseInt(req.params.id);
      
      if (isNaN(companyId)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }
      
      const company = await storage.getCompany(companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      // Basic authorization: check if the user owns the company
      if (company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to access this company" });
      }
      
      return res.json(company);
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  // STAKEHOLDER ROUTES
  app.post("/api/companies/:id/stakeholders", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const companyId = parseInt(req.params.id);
      
      if (isNaN(companyId)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }
      
      const company = await storage.getCompany(companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      // Basic authorization: check if the user owns the company
      if (company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to add stakeholders to this company" });
      }
      
      const stakeholderData = insertStakeholderSchema.parse({
        ...req.body,
        companyId
      });
      
      const stakeholder = await storage.createStakeholder(stakeholderData);
      return res.status(201).json(stakeholder);
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  app.get("/api/companies/:id/stakeholders", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const companyId = parseInt(req.params.id);
      
      if (isNaN(companyId)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }
      
      const company = await storage.getCompany(companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      // Basic authorization: check if the user owns the company
      if (company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to view stakeholders for this company" });
      }
      
      const stakeholders = await storage.getStakeholdersByCompanyId(companyId);
      return res.json(stakeholders);
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  // FINANCIAL DATA ROUTES
  app.post("/api/companies/:id/financials", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const companyId = parseInt(req.params.id);
      
      if (isNaN(companyId)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }
      
      const company = await storage.getCompany(companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      // Basic authorization: check if the user owns the company
      if (company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to add financial data to this company" });
      }
      
      const financialData = insertFinancialDataSchema.parse({
        ...req.body,
        companyId
      });
      
      const financials = await storage.createFinancialData(financialData);
      return res.status(201).json(financials);
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  app.get("/api/companies/:id/financials", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const companyId = parseInt(req.params.id);
      
      if (isNaN(companyId)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }
      
      const company = await storage.getCompany(companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      // Basic authorization: check if the user owns the company
      if (company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to view financial data for this company" });
      }
      
      const financials = await storage.getFinancialDataByCompanyId(companyId);
      
      if (!financials) {
        return res.status(404).json({ message: "Financial data not found for this company" });
      }
      
      return res.json(financials);
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  // TOKEN ROUTES
  app.post("/api/companies/:id/tokens", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const companyId = parseInt(req.params.id);
      
      if (isNaN(companyId)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }
      
      const company = await storage.getCompany(companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      // Basic authorization: check if the user owns the company
      if (company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to add token data to this company" });
      }
      
      const tokenData = insertTokenInfoSchema.parse({
        ...req.body,
        companyId
      });
      
      const tokenInfo = await storage.createTokenInfo(tokenData);
      return res.status(201).json(tokenInfo);
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  app.get("/api/companies/:id/tokens", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const companyId = parseInt(req.params.id);
      
      if (isNaN(companyId)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }
      
      const company = await storage.getCompany(companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      // Basic authorization: check if the user owns the company
      if (company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to view token data for this company" });
      }
      
      const tokenInfo = await storage.getTokenInfoByCompanyId(companyId);
      
      if (!tokenInfo) {
        return res.status(404).json({ message: "Token data not found for this company" });
      }
      
      return res.json(tokenInfo);
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  // VALUATION ROUTES
  app.post("/api/companies/:id/valuation", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const companyId = parseInt(req.params.id);
      
      if (isNaN(companyId)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }
      
      const company = await storage.getCompany(companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      // Basic authorization: check if the user owns the company
      if (company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to calculate valuation for this company" });
      }
      
      const { method, params } = z.object({
        method: z.enum(["dcf", "comparable", "multiple"]),
        params: z.record(z.string(), z.any()).optional(),
      }).parse(req.body);
      
      const financialData = await storage.getFinancialDataByCompanyId(companyId);
      
      if (!financialData) {
        return res.status(400).json({ message: "Financial data required for valuation calculation" });
      }
      
      // Calculate valuation based on the method
      const valuation = calculateValuation(company, financialData, method, params || {});
      
      // Update company with new valuation
      const updatedCompany = await storage.updateCompanyValuation(companyId, valuation);
      
      return res.json({ 
        company: updatedCompany,
        valuation,
        method,
        calculatedAt: new Date()
      });
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  // DOCUMENT GENERATION ROUTES
  app.post("/api/companies/:id/documents/equity-agreement", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const companyId = parseInt(req.params.id);
      
      if (isNaN(companyId)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }
      
      const { stakeholderId } = z.object({
        stakeholderId: z.number(),
      }).parse(req.body);
      
      const company = await storage.getCompany(companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      // Basic authorization: check if the user owns the company
      if (company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to generate documents for this company" });
      }
      
      const stakeholder = await storage.getStakeholder(stakeholderId);
      
      if (!stakeholder || stakeholder.companyId !== companyId) {
        return res.status(404).json({ message: "Stakeholder not found or not associated with this company" });
      }
      
      // Generate equity agreement document
      const agreementText = await generatePDF(
        await generateEquityAgreement(
          company.name, 
          company.entityType, 
          stakeholder.name, 
          stakeholder.shares, 
          stakeholder.equityType, 
          parseFloat(stakeholder.ownershipPercentage), 
          stakeholder.vestingSchedule || undefined
        )
      );
      
      // Create document in database
      const document = await storage.createDocument({
        companyId,
        stakeholderId,
        title: `Equity Agreement - ${stakeholder.name}`,
        content: agreementText.toString(),
        type: "equity_agreement"
      });
      
      return res.status(201).json(document);
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  app.post("/api/documents/:id/sign", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const documentId = parseInt(req.params.id);
      
      if (isNaN(documentId)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }
      
      const document = await storage.getDocument(documentId);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      const company = await storage.getCompany(document.companyId);
      
      if (!company || company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to sign this document" });
      }
      
      // Send document for electronic signature
      const documentBuffer = Buffer.from(document.content);
      const envelopeId = await signDocument(documentBuffer, document.title);
      
      // Update document status
      const updatedDocument = await storage.updateDocumentSigned(documentId, true);
      
      return res.json({
        document: updatedDocument,
        envelopeId,
        status: "sent_for_signature"
      });
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  // FINANCIAL CALCULATION ROUTES
  app.get("/api/financial/runway", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // For now, just return data for the first company
      const companies = await storage.getCompaniesByUserId(req.session.userId);
      
      if (companies.length === 0) {
        return res.status(404).json({ message: "No companies found" });
      }
      
      const companyId = companies[0].id;
      const financialData = await storage.getFinancialDataByCompanyId(companyId);
      
      if (!financialData) {
        return res.status(404).json({ message: "Financial data not found" });
      }
      
      // Calculate runway
      const cashBalance = parseFloat(financialData.cashBalance);
      const burnRate = parseFloat(financialData.burnRate);
      const runwayMonths = Math.floor(cashBalance / burnRate);
      
      return res.json({
        cashBalance,
        burnRate,
        runwayMonths,
        companyId
      });
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  // EQUITY VISUALIZATION DATA
  app.get("/api/equity", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // For now, just return data for the first company
      const companies = await storage.getCompaniesByUserId(req.session.userId);
      
      if (companies.length === 0) {
        return res.status(404).json({ message: "No companies found" });
      }
      
      const companyId = companies[0].id;
      const stakeholders = await storage.getStakeholdersByCompanyId(companyId);
      
      // Format stakeholders with unique colors for visualization
      const colors = [
        "#4C6EF5", "#339AF0", "#20C997", "#51CF66", 
        "#FF922B", "#FF6B6B", "#CC5DE8", "#845EF7"
      ];
      
      const formattedStakeholders = stakeholders.map((s, index) => ({
        id: String(s.id),
        name: s.name,
        role: s.role,
        shares: s.shares,
        ownershipPercentage: parseFloat(s.ownershipPercentage),
        color: colors[index % colors.length]
      }));
      
      return res.json({
        companyId,
        stakeholders: formattedStakeholders,
        totalShares: formattedStakeholders.reduce((sum, s) => sum + s.shares, 0)
      });
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  // TOKEN INFO
  app.get("/api/token", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // For now, just return data for the first company
      const companies = await storage.getCompaniesByUserId(req.session.userId);
      
      if (companies.length === 0) {
        return res.status(404).json({ message: "No companies found" });
      }
      
      const companyId = companies[0].id;
      const tokenInfo = await storage.getTokenInfoByCompanyId(companyId);
      
      if (!tokenInfo) {
        return res.status(404).json({ message: "Token info not found" });
      }
      
      const tokenTransfers = await storage.getTokenTransfersByTokenId(tokenInfo.id);
      
      return res.json({
        ...tokenInfo,
        totalSupply: parseInt(tokenInfo.totalSupply),
        recentTransfers: tokenTransfers
      });
    } catch (error) {
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  // Create the HTTP server
  const server = createServer(app);
  return server;
}