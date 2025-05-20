import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
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
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
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
      req.session!.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      return res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return res.json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      
      res.clearCookie("connect.sid");
      return res.json({ message: "Logged out successfully" });
    });
  });

  // COMPANY ROUTES
  app.post("/api/companies", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const companyData = {
        ...insertCompanySchema.parse(req.body),
        userId: req.session.userId
      };
      
      const company = await storage.createCompany(companyData);
      return res.status(201).json(company);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/companies", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const companies = await storage.getCompaniesByUserId(req.session.userId);
      return res.json(companies);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/companies/current", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      // Get the user's current active company (most recently created or accessed)
      const companies = await storage.getCompaniesByUserId(req.session.userId);
      
      if (companies.length === 0) {
        return res.status(404).json({ message: "No companies found" });
      }
      
      // Return the most recently created company
      return res.json(companies[0]);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const companyId = parseInt(req.params.id);
      const company = await storage.getCompany(companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      // Check if user has access to this company
      if (company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized access to company" });
      }
      
      return res.json(company);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // STAKEHOLDER ROUTES
  app.post("/api/stakeholders", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const stakeholderData = insertStakeholderSchema.parse(req.body);
      
      // Verify company exists and user has access
      const company = await storage.getCompany(stakeholderData.companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      if (company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized access to company" });
      }
      
      const stakeholder = await storage.createStakeholder(stakeholderData);
      return res.status(201).json(stakeholder);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/stakeholders", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : null;
    
    if (!companyId) {
      // If no company ID provided, try to get stakeholders for the current company
      try {
        const companies = await storage.getCompaniesByUserId(req.session.userId);
        
        if (companies.length === 0) {
          return res.status(404).json({ message: "No companies found" });
        }
        
        const currentCompany = companies[0];
        const stakeholders = await storage.getStakeholdersByCompanyId(currentCompany.id);
        
        // Add avatar initials to each stakeholder
        const stakeholdersWithInitials = stakeholders.map(stakeholder => ({
          ...stakeholder,
          avatarInitials: stakeholder.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
        }));
        
        return res.json(stakeholdersWithInitials);
      } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
      }
    } else {
      // Get stakeholders for the specified company
      try {
        // Verify company exists and user has access
        const company = await storage.getCompany(companyId);
        
        if (!company) {
          return res.status(404).json({ message: "Company not found" });
        }
        
        if (company.userId !== req.session.userId) {
          return res.status(403).json({ message: "Unauthorized access to company" });
        }
        
        const stakeholders = await storage.getStakeholdersByCompanyId(companyId);
        
        // Add avatar initials to each stakeholder
        const stakeholdersWithInitials = stakeholders.map(stakeholder => ({
          ...stakeholder,
          avatarInitials: stakeholder.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
        }));
        
        return res.json(stakeholdersWithInitials);
      } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // FINANCIAL DATA ROUTES
  app.post("/api/financial", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const financialData = insertFinancialDataSchema.parse(req.body);
      
      // Verify company exists and user has access
      const company = await storage.getCompany(financialData.companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      if (company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized access to company" });
      }
      
      const finData = await storage.createFinancialData(financialData);
      return res.status(201).json(finData);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/financial/runway", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      // Get the user's current active company
      const companies = await storage.getCompaniesByUserId(req.session.userId);
      
      if (companies.length === 0) {
        return res.status(404).json({ message: "No companies found" });
      }
      
      const currentCompany = companies[0];
      const financialData = await storage.getFinancialDataByCompanyId(currentCompany.id);
      
      if (!financialData) {
        // Return default data if no financial data exists yet
        return res.json({
          cashBalance: 595000,
          burnRate: 42500,
          runwayMonths: 14
        });
      }
      
      // Calculate runway months
      const runwayMonths = Math.floor(Number(financialData.cashBalance) / Number(financialData.burnRate));
      
      return res.json({
        cashBalance: Number(financialData.cashBalance),
        burnRate: Number(financialData.burnRate),
        runwayMonths
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // EQUITY ROUTES
  app.get("/api/equity", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      // Get the user's current active company
      const companies = await storage.getCompaniesByUserId(req.session.userId);
      
      if (companies.length === 0) {
        return res.status(404).json({ message: "No companies found" });
      }
      
      const currentCompany = companies[0];
      const stakeholders = await storage.getStakeholdersByCompanyId(currentCompany.id);
      
      // Calculate total shares allocated
      const totalAllocatedShares = stakeholders.reduce((total, stakeholder) => total + stakeholder.shares, 0);
      
      // Format stakeholders for API response
      const stakeholdersWithInitials = stakeholders.map(stakeholder => ({
        ...stakeholder,
        avatarInitials: stakeholder.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
      }));
      
      // Group stakeholders by type for equity distribution visualization
      const founders = stakeholders.filter(s => s.role.toLowerCase().includes('founder'));
      const investors = stakeholders.filter(s => s.role.toLowerCase().includes('investor'));
      const otherStakeholders = stakeholders.filter(s => 
        !s.role.toLowerCase().includes('founder') && 
        !s.role.toLowerCase().includes('investor')
      );
      
      // Calculate percentages for each group
      const foundersShares = founders.reduce((total, founder) => total + founder.shares, 0);
      const investorsShares = investors.reduce((total, investor) => total + investor.shares, 0);
      const otherShares = otherStakeholders.reduce((total, other) => total + other.shares, 0);
      const optionPoolShares = currentCompany.authorizedShares - totalAllocatedShares;
      
      // Format distribution for visualization
      const distribution = [
        {
          id: '1',
          name: 'Founders',
          percentage: Math.round((foundersShares / currentCompany.authorizedShares) * 100),
          shares: foundersShares,
          color: '#3f51b5'
        },
        {
          id: '2',
          name: 'Investors',
          percentage: Math.round((investorsShares / currentCompany.authorizedShares) * 100),
          shares: investorsShares,
          color: '#4caf50'
        },
        {
          id: '3',
          name: 'Option Pool',
          percentage: Math.round((optionPoolShares / currentCompany.authorizedShares) * 100),
          shares: optionPoolShares,
          color: '#ff9800'
        }
      ];
      
      if (otherShares > 0) {
        distribution.push({
          id: '4',
          name: 'Other',
          percentage: Math.round((otherShares / currentCompany.authorizedShares) * 100),
          shares: otherShares,
          color: '#f44336'
        });
      }
      
      return res.json({
        stakeholders: stakeholdersWithInitials,
        totalAllocatedShares,
        totalAuthorizedShares: currentCompany.authorizedShares,
        unallocatedShares: currentCompany.authorizedShares - totalAllocatedShares,
        distribution
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // TOKEN ROUTES
  app.post("/api/token", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const tokenData = insertTokenInfoSchema.parse(req.body);
      
      // Verify company exists and user has access
      const company = await storage.getCompany(tokenData.companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      if (company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized access to company" });
      }
      
      const token = await storage.createTokenInfo(tokenData);
      return res.status(201).json(token);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/token", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      // Get the user's current active company
      const companies = await storage.getCompaniesByUserId(req.session.userId);
      
      if (companies.length === 0) {
        return res.status(404).json({ message: "No companies found" });
      }
      
      const currentCompany = companies[0];
      const tokenInfo = await storage.getTokenInfoByCompanyId(currentCompany.id);
      
      if (!tokenInfo) {
        // Return default token info if none exists yet
        return res.json({
          name: `${currentCompany.name} Equity Token`,
          symbol: currentCompany.name.split(' ')[0].substring(0, 3).toUpperCase() + 'ET',
          contractAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
          totalSupply: currentCompany.authorizedShares,
          network: 'Ethereum Mainnet',
          recentTransfers: [
            {
              id: 1,
              amount: 500000,
              from: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
              to: '0x7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u',
              timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000
            },
            {
              id: 2,
              amount: 250000,
              from: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
              to: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v',
              timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000
            }
          ]
        });
      }
      
      // Get token transfers
      const tokenTransfers = await storage.getTokenTransfersByTokenId(tokenInfo.id);
      
      return res.json({
        ...tokenInfo,
        recentTransfers: tokenTransfers
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/token/transfer", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const transferData = insertTokenTransferSchema.parse(req.body);
      
      // Verify token exists
      const token = await storage.getTokenInfo(transferData.tokenId);
      
      if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }
      
      // Verify company exists and user has access
      const company = await storage.getCompany(token.companyId);
      
      if (!company || company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
      
      const transfer = await storage.createTokenTransfer(transferData);
      return res.status(201).json(transfer);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // DOCUMENT ROUTES
  app.post("/api/documents", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      
      // Verify company exists and user has access
      const company = await storage.getCompany(documentData.companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      if (company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized access to company" });
      }
      
      const document = await storage.createDocument(documentData);
      return res.status(201).json(document);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/documents", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : null;
    
    if (!companyId) {
      // If no company ID provided, get documents for current company
      try {
        const companies = await storage.getCompaniesByUserId(req.session.userId);
        
        if (companies.length === 0) {
          return res.status(404).json({ message: "No companies found" });
        }
        
        const currentCompany = companies[0];
        const documents = await storage.getDocumentsByCompanyId(currentCompany.id);
        return res.json(documents);
      } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
      }
    } else {
      // Get documents for specified company
      try {
        // Verify company exists and user has access
        const company = await storage.getCompany(companyId);
        
        if (!company) {
          return res.status(404).json({ message: "Company not found" });
        }
        
        if (company.userId !== req.session.userId) {
          return res.status(403).json({ message: "Unauthorized access to company" });
        }
        
        const documents = await storage.getDocumentsByCompanyId(companyId);
        return res.json(documents);
      } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post("/api/documents/:id/sign", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const documentId = parseInt(req.params.id);
      const document = await storage.getDocument(documentId);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Verify company exists and user has access
      const company = await storage.getCompany(document.companyId);
      
      if (!company || company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
      
      // Generate PDF
      const pdfBuffer = await generatePDF(document.content);
      
      // Initialize DocuSign signing
      const signingUrl = await signDocument(pdfBuffer, document.title);
      
      // Update document as signed
      await storage.updateDocumentSigned(documentId, true);
      
      return res.json({ signingUrl });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/documents/generate", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { companyId, stakeholderId, documentType } = z.object({
        companyId: z.number(),
        stakeholderId: z.number().optional(),
        documentType: z.string()
      }).parse(req.body);
      
      // Verify company exists and user has access
      const company = await storage.getCompany(companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      if (company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized access to company" });
      }
      
      let stakeholder = null;
      if (stakeholderId) {
        stakeholder = await storage.getStakeholder(stakeholderId);
        if (!stakeholder || stakeholder.companyId !== companyId) {
          return res.status(404).json({ message: "Stakeholder not found" });
        }
      }
      
      // Generate document content based on type
      let title, content;
      
      switch (documentType) {
        case 'equity-agreement':
          if (!stakeholder) {
            return res.status(400).json({ message: "Stakeholder ID required for equity agreements" });
          }
          title = `Equity Agreement - ${stakeholder.name}`;
          content = `EQUITY AGREEMENT

THIS EQUITY AGREEMENT (the "Agreement") is made and entered into as of ${new Date().toLocaleDateString()}, by and between ${company.name} (the "Company"), a ${company.entityType}, and ${stakeholder.name} (the "Recipient").

WHEREAS, the Company desires to grant to the Recipient ${stakeholder.shares.toLocaleString()} shares of the Company's ${stakeholder.equityType}, representing ${stakeholder.ownershipPercentage}% ownership in the Company.

NOW, THEREFORE, in consideration of the mutual covenants and agreements set forth herein, the parties agree as follows:

1. GRANT OF EQUITY
Subject to the terms and conditions of this Agreement, the Company hereby grants to the Recipient ${stakeholder.shares.toLocaleString()} shares of the Company's ${stakeholder.equityType}.

2. VESTING SCHEDULE
The shares granted hereunder shall vest according to the following schedule: ${stakeholder.vestingSchedule || "Standard 4 years with 1 year cliff"}

3. REPRESENTATIONS AND WARRANTIES
The Recipient represents and warrants that they have the full right and authority to enter into this Agreement and to perform their obligations hereunder.

4. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the state of Delaware.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

COMPANY:
${company.name}

By: _________________________
Name: 
Title: 

RECIPIENT:
${stakeholder.name}

_________________________
Signature`;
          break;
          
        case 'operating-agreement':
          title = `Operating Agreement - ${company.name}`;
          content = `OPERATING AGREEMENT
          
THIS OPERATING AGREEMENT (the "Agreement") is made and entered into as of ${new Date().toLocaleDateString()}, by and among the members of ${company.name} (the "Company"), a ${company.entityType}.

ARTICLE I - ORGANIZATION
1.1 Formation. The Company was formed as a ${company.entityType.includes('LLC') ? 'limited liability company' : 'corporation'} on ${company.founded}.
1.2 Name. The name of the Company is ${company.name}.
1.3 Principal Place of Business. The Company's principal place of business shall be determined by the ${company.entityType.includes('LLC') ? 'Members' : 'Board of Directors'}.

ARTICLE II - MEMBERS AND CAPITAL CONTRIBUTIONS
2.1 Initial Members and Capital Contributions. The initial members of the Company and their respective capital contributions and ownership percentages are as follows:

${(await storage.getStakeholdersByCompanyId(companyId))
  .map(s => `- ${s.name}: ${s.shares.toLocaleString()} shares (${s.ownershipPercentage}%)`)
  .join('\n')}

ARTICLE III - MANAGEMENT
3.1 Management. The business and affairs of the Company shall be managed by ${company.entityType.includes('LLC') ? 'the Members in proportion to their ownership interest' : 'the Board of Directors elected by the shareholders'}.

ARTICLE IV - DISTRIBUTIONS
4.1 Distributions. Distributions shall be made to the ${company.entityType.includes('LLC') ? 'Members at such times and in such amounts as determined by the Members' : 'Shareholders at such times and in such amounts as determined by the Board of Directors'}.

ARTICLE V - TRANSFER OF INTERESTS
5.1 Restrictions on Transfer. No Member may transfer all or any portion of their interest in the Company without the prior written consent of all other Members.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.`;
          break;
          
        case 'valuation-report':
          title = `Valuation Report - ${company.name}`;
          content = `VALUATION REPORT

COMPANY: ${company.name}
DATE: ${new Date().toLocaleDateString()}
ENTITY TYPE: ${company.entityType}

VALUATION SUMMARY
Based on our analysis, ${company.name} has an estimated valuation of $${company.valuation ? company.valuation.toLocaleString() : "To be determined"}.

METHODOLOGY
This valuation was determined using multiple methodologies including:
1. Comparable company analysis
2. Discounted cash flow analysis
3. Precedent transactions
4. Market multiples

EQUITY BREAKDOWN
Total Authorized Shares: ${company.authorizedShares.toLocaleString()}

Equity Distribution:
${(await storage.getStakeholdersByCompanyId(companyId))
  .map(s => `- ${s.name} (${s.role}): ${s.shares.toLocaleString()} shares (${s.ownershipPercentage}%)`)
  .join('\n')}

FINANCIAL METRICS
${(() => {
  const financialData = storage.getFinancialDataByCompanyId(companyId);
  if (!financialData) return "Financial data not yet available";
  return `Cash Balance: $${financialData.cashBalance}
Monthly Burn Rate: $${financialData.burnRate}
Estimated Runway: ${Math.floor(Number(financialData.cashBalance) / Number(financialData.burnRate))} months`;
})()}

This valuation report is for informational purposes only and should not be considered a formal appraisal.`;
          break;
          
        default:
          return res.status(400).json({ message: "Invalid document type" });
      }
      
      // Save document to database
      const document = await storage.createDocument({
        title,
        content,
        type: documentType,
        companyId,
        stakeholderId: stakeholderId || null
      });
      
      return res.status(201).json(document);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // VALUATION ROUTES
  app.post("/api/valuation/calculate", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { companyId, method, params } = z.object({
        companyId: z.number(),
        method: z.enum(['comparable', 'dcf', 'multiple']),
        params: z.record(z.any()).optional()
      }).parse(req.body);
      
      // Verify company exists and user has access
      const company = await storage.getCompany(companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      if (company.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized access to company" });
      }
      
      const financialData = await storage.getFinancialDataByCompanyId(companyId);
      
      // Calculate valuation based on method and params
      const valuation = calculateValuation(company, financialData, method, params);
      
      // Update company valuation
      await storage.updateCompanyValuation(companyId, valuation);
      
      return res.json({ valuation });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
