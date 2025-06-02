import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import OpenAI from "openai";

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
  // CHAT/AI ENDPOINT - Register first to avoid middleware conflicts
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, context } = z.object({
        message: z.string(),
        context: z.string().optional(),
      }).parse(req.body);

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ 
          error: "OpenAI API key not configured. Please provide your OPENAI_API_KEY to enable AI chat functionality." 
        });
      }

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const systemPrompt = context || `You are Pie Bot, an AI assistant specialized in startup equity management, legal processes, blockchain/Web3 integration, and financial operations. You help founders with:

- Equity splits and dynamic equity calculations
- Legal document generation (incorporation, agreements, etc.)
- Blockchain tokenization and smart contracts
- Fundraising and valuation analysis
- Financial planning and runway calculations
- ENS domain registration and wallet management

Provide practical, actionable advice. Keep responses concise and focused on the user's specific question. If they ask about technical implementation, provide specific guidance.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || "I'm having trouble processing that request right now.";

      return res.json({ response });

    } catch (error) {
      console.error("OpenAI API error:", error);
      
      if (error instanceof Error && error.message.includes('API key')) {
        return res.status(401).json({ 
          error: "Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable." 
        });
      }
      
      return res.status(500).json({ 
        error: "AI service temporarily unavailable. Try specific commands like 'help', 'equity split', or 'valuation'." 
      });
    }
  });

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
          stakeholder.ownershipPercentage, 
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

  // COMPANY FORMATION ENDPOINTS
  app.post("/api/companies/form-wyoming-llc", async (req, res) => {
    try {
      const wyomingLLCData = z.object({
        companyName: z.string().min(1, "Company name is required"),
        registeredAgent: z.string(),
        organizer: z.string().min(1, "Organizer name is required"),
        organizerAddress: z.string().min(1, "Organizer address is required"),
        managementStructure: z.enum(["member-managed", "manager-managed"]),
        businessPurpose: z.string().default("any lawful business purpose"),
        initialMembers: z.array(z.object({
          name: z.string().min(1, "Member name is required"),
          address: z.string().min(1, "Member address is required"),
          ownershipPercent: z.number().min(0).max(100)
        })).min(1, "At least one member is required"),
        expediteProcessing: z.boolean().default(false)
      }).parse(req.body);

      // Validate ownership percentages add up to 100%
      const totalOwnership = wyomingLLCData.initialMembers.reduce((sum, member) => sum + member.ownershipPercent, 0);
      if (Math.abs(totalOwnership - 100) > 0.01) {
        return res.status(400).json({ 
          error: `Ownership percentages must total 100%. Current total: ${totalOwnership}%` 
        });
      }

      // Add "LLC" suffix if not present
      const companyName = wyomingLLCData.companyName.endsWith(' LLC') ? 
        wyomingLLCData.companyName : 
        `${wyomingLLCData.companyName} LLC`;

      // Create company record
      const newCompany = await storage.createCompany({
        name: companyName,
        entityType: "Wyoming LLC",
        userId: req.session.userId!,
        valuation: "0",
        authorizedShares: 1000000, // Default for LLC units
        founded: new Date()
      });

      // Create stakeholder records for each member
      for (const member of wyomingLLCData.initialMembers) {
        await storage.createStakeholder({
          name: member.name,
          email: member.address, // Using address as placeholder for email
          role: "Member",
          ownershipPercentage: member.ownershipPercent.toString(),
          shares: Math.floor((member.ownershipPercent / 100) * 1000000),
          companyId: newCompany.id,
          equityType: "Membership Units"
        });
      }

      // Generate formation documents
      const formationDocuments = await generateWyomingLLCDocuments(wyomingLLCData);
      
      // Store formation record
      await storage.createDocument({
        title: `${companyName} - Articles of Organization`,
        type: "Formation Documents",
        content: formationDocuments.articlesOfOrganization,
        companyId: newCompany.id
      });

      await storage.createDocument({
        title: `${companyName} - Operating Agreement`,
        type: "Operating Agreement", 
        content: formationDocuments.operatingAgreement,
        companyId: newCompany.id
      });

      // Calculate total cost based on registered agent selection
      const getRegisteredAgentCost = (agent: string) => {
        switch (agent) {
          case 'self': return 0;
          case 'northwest-registered-agent': return 139;
          default: return 0;
        }
      };

      const agentCost = getRegisteredAgentCost(wyomingLLCData.registeredAgent);
      const totalCost = 102 + agentCost; // $100 state fee + $2 processing + agent cost

      return res.json({
        company: newCompany,
        status: "Formation initiated",
        estimatedCompletion: "1-2 business days",
        filingFee: totalCost,
        registeredAgent: {
          service: wyomingLLCData.registeredAgent,
          cost: agentCost,
          coverage: wyomingLLCData.registeredAgent === 'self' ? 'Wyoming only' : '50-state coverage'
        },
        documents: [
          "Articles of Organization",
          "Operating Agreement",
          "EIN Application (Form SS-4)"
        ]
      });

    } catch (error) {
      console.error("Wyoming LLC formation error:", error);
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  app.post("/api/companies/import", async (req, res) => {
    try {
      console.log("Import request body:", req.body);
      const importData = z.object({
        name: z.string().min(1, "Company name is required"),
        entityType: z.string().min(1, "Entity type is required"),
        state: z.string().min(1, "State of incorporation is required"),
        jurisdiction: z.string().optional(),
        ein: z.string().optional(),
        address: z.string().optional(),
        founded: z.string().optional(),
        industry: z.string().optional(),
        status: z.string().optional(),
        registeredAgent: z.string().optional(),
        businessPurpose: z.string().optional()
      }).parse(req.body);

      // Create company record
      const importedCompany = await storage.createCompany({
        name: importData.name,
        entityType: `${importData.state} ${importData.entityType}`,
        userId: req.session.userId!,
        valuation: 0,
        authorizedShares: 10000000, // Default
        founded: importData.founded || new Date().getFullYear().toString()
      });

      // Create initial stakeholder record for the importing user
      await storage.createStakeholder({
        name: "Imported Owner", // This would be updated with actual data
        role: "Founder",
        equityPercentage: 100, // Placeholder - would be updated with actual equity data
        shares: 10000000,
        companyId: importedCompany.id,
        address: importData.address || "",
        equityType: importData.entityType === "LLC" ? "Membership Units" : "Common Stock"
      });

      return res.json({
        company: importedCompany,
        status: "Import completed",
        message: "Company imported successfully. Please update equity information in the dashboard."
      });

    } catch (error) {
      console.error("Company import error:", error);
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  // IDENTITY VERIFICATION ENDPOINTS
  app.post("/api/identity/start-verification", async (req, res) => {
    try {
      const { purpose } = z.object({
        purpose: z.string()
      }).parse(req.body);

      // For now, return a mock verification ID
      // In production, this would integrate with services like Jumio, Onfido, or Persona
      const verificationId = `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return res.json({
        verificationId,
        status: "pending",
        purpose
      });

    } catch (error) {
      console.error("Identity verification start error:", error);
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  app.post("/api/identity/complete-verification", async (req, res) => {
    try {
      const verificationData = z.object({
        verificationId: z.string(),
        fullName: z.string(),
        address: z.string(),
        email: z.string(),
        phone: z.string(),
        dateOfBirth: z.string()
      }).parse(req.body);

      // In production, this would:
      // 1. Submit documents to identity verification service
      // 2. Perform KYC/AML checks
      // 3. Verify government ID documents
      // 4. Cross-reference with credit bureaus or other databases

      return res.json({
        verificationId: verificationData.verificationId,
        status: "verified",
        fullName: verificationData.fullName,
        address: verificationData.address,
        email: verificationData.email,
        phone: verificationData.phone,
        dateOfBirth: verificationData.dateOfBirth,
        verifiedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error("Identity verification completion error:", error);
      const errorResponse = handleZodError(error);
      return res.status(errorResponse.message.includes("Internal") ? 500 : 400).json(errorResponse);
    }
  });

  // Create the HTTP server
  const server = createServer(app);
  return server;
}

// Helper function to generate Wyoming LLC formation documents
async function generateWyomingLLCDocuments(data: any) {
  const articlesOfOrganization = `
ARTICLES OF ORGANIZATION
LIMITED LIABILITY COMPANY
State of Wyoming

Article I - Name
The name of the Limited Liability Company is: ${data.companyName.endsWith(' LLC') ? data.companyName : data.companyName + ' LLC'}

Article II - Registered Agent and Office
The name and address of the registered agent is:
${data.registeredAgent === 'self' ? data.organizer : 'Wyoming Registered Agents LLC'}
${data.registeredAgent === 'self' ? data.organizerAddress : '30 N Gould St Ste R, Sheridan, WY 82801'}

Article III - Management
This Limited Liability Company will be ${data.managementStructure}.

Article IV - Purpose
The purpose of this Limited Liability Company is: ${data.businessPurpose}

Article V - Members
Initial Members:
${data.initialMembers.map((member: any) => 
  `${member.name} - ${member.ownershipPercent}% ownership\nAddress: ${member.address}`
).join('\n\n')}

Article VI - Organizer
This Limited Liability Company is organized by:
${data.organizer}
${data.organizerAddress}

Date: ${new Date().toLocaleDateString()}
Organizer Signature: _________________________
`;

  const operatingAgreement = `
OPERATING AGREEMENT
${data.companyName.endsWith(' LLC') ? data.companyName : data.companyName + ' LLC'}

This Operating Agreement is made on ${new Date().toLocaleDateString()} by and among the members listed below.

ARTICLE 1 - FORMATION
1.1 Formation: The Company was formed as a Wyoming Limited Liability Company.
1.2 Name: ${data.companyName.endsWith(' LLC') ? data.companyName : data.companyName + ' LLC'}
1.3 Purpose: ${data.businessPurpose}

ARTICLE 2 - MEMBERS AND OWNERSHIP
2.1 Initial Members and Ownership:
${data.initialMembers.map((member: any) => 
  `${member.name}: ${member.ownershipPercent}% ownership`
).join('\n')}

ARTICLE 3 - MANAGEMENT
3.1 Management Structure: This LLC is ${data.managementStructure}.
${data.managementStructure === 'member-managed' ? 
  '3.2 Member Management: All members participate in management decisions.' :
  '3.3 Manager Management: Management is delegated to appointed managers.'
}

ARTICLE 4 - CAPITAL CONTRIBUTIONS
4.1 Initial Contributions: Members shall make initial contributions as agreed.

ARTICLE 5 - DISTRIBUTIONS
5.1 Distribution Policy: Distributions shall be made pro rata based on ownership percentages.

ARTICLE 6 - TRANSFER OF INTERESTS
6.1 Transfer Restrictions: Membership interests may not be transferred without consent of other members.

This Operating Agreement shall be binding upon the members and their successors.

Members:
${data.initialMembers.map((member: any) => 
  `${member.name}: ___________________________ Date: ___________`
).join('\n')}
`;

  return {
    articlesOfOrganization,
    operatingAgreement
  };
}