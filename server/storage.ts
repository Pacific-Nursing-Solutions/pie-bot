import {
  users,
  companies,
  stakeholders,
  financialData,
  tokenInfo,
  tokenTransfers,
  documents,
  type User,
  type InsertUser,
  type Company,
  type InsertCompany,
  type Stakeholder,
  type InsertStakeholder,
  type FinancialData as FinancialDataType,
  type InsertFinancialData,
  type TokenInfo,
  type InsertTokenInfo,
  type TokenTransfer,
  type InsertTokenTransfer,
  type Document,
  type InsertDocument
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Company operations
  getCompany(id: number): Promise<Company | undefined>;
  getCompaniesByUserId(userId: number): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompanyValuation(id: number, valuation: number): Promise<Company>;
  
  // Stakeholder operations
  getStakeholder(id: number): Promise<Stakeholder | undefined>;
  getStakeholdersByCompanyId(companyId: number): Promise<Stakeholder[]>;
  createStakeholder(stakeholder: InsertStakeholder): Promise<Stakeholder>;
  
  // Financial data operations
  getFinancialData(id: number): Promise<FinancialDataType | undefined>;
  getFinancialDataByCompanyId(companyId: number): Promise<FinancialDataType | undefined>;
  createFinancialData(data: InsertFinancialData): Promise<FinancialDataType>;
  
  // Token operations
  getTokenInfo(id: number): Promise<TokenInfo | undefined>;
  getTokenInfoByCompanyId(companyId: number): Promise<TokenInfo | undefined>;
  createTokenInfo(token: InsertTokenInfo): Promise<TokenInfo>;
  
  // Token transfer operations
  getTokenTransfer(id: number): Promise<TokenTransfer | undefined>;
  getTokenTransfersByTokenId(tokenId: number): Promise<TokenTransfer[]>;
  createTokenTransfer(transfer: InsertTokenTransfer): Promise<TokenTransfer>;
  
  // Document operations
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsByCompanyId(companyId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocumentSigned(id: number, signed: boolean): Promise<Document>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private companies: Map<number, Company>;
  private stakeholders: Map<number, Stakeholder>;
  private financialData: Map<number, FinancialDataType>;
  private tokenInfos: Map<number, TokenInfo>;
  private tokenTransfers: Map<number, TokenTransfer>;
  private documents: Map<number, Document>;
  
  private currentUserId: number;
  private currentCompanyId: number;
  private currentStakeholderId: number;
  private currentFinancialDataId: number;
  private currentTokenInfoId: number;
  private currentTokenTransferId: number;
  private currentDocumentId: number;

  constructor() {
    this.users = new Map();
    this.companies = new Map();
    this.stakeholders = new Map();
    this.financialData = new Map();
    this.tokenInfos = new Map();
    this.tokenTransfers = new Map();
    this.documents = new Map();
    
    this.currentUserId = 1;
    this.currentCompanyId = 1;
    this.currentStakeholderId = 1;
    this.currentFinancialDataId = 1;
    this.currentTokenInfoId = 1;
    this.currentTokenTransferId = 1;
    this.currentDocumentId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // Initialize with sample data for demonstration
  private initializeSampleData() {
    // Create sample user
    const user: User = {
      id: this.currentUserId++,
      username: 'demo',
      password: 'password',
      email: 'demo@example.com',
      fullName: 'Demo User',
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    
    // Create sample company
    const company: Company = {
      id: this.currentCompanyId++,
      name: 'TechFusion, Inc.',
      entityType: 'Delaware C Corporation',
      founded: new Date(2023, 0, 15), // January 15, 2023
      valuation: "4750000",
      authorizedShares: 10000000,
      userId: user.id,
      createdAt: new Date()
    };
    this.companies.set(company.id, company);
    
    // Create sample stakeholders
    const founder1: Stakeholder = {
      id: this.currentStakeholderId++,
      name: 'Maria Silva',
      email: 'maria@techfusion.com',
      role: 'CEO & Co-Founder',
      equityType: 'Common Stock',
      ownershipPercentage: 35,
      shares: 3500000,
      vestingSchedule: 'Standard 4 years with 1 year cliff',
      companyId: company.id,
      createdAt: new Date()
    };
    this.stakeholders.set(founder1.id, founder1);
    
    const founder2: Stakeholder = {
      id: this.currentStakeholderId++,
      name: 'James Kim',
      email: 'james@techfusion.com',
      role: 'CTO & Co-Founder',
      equityType: 'Common Stock',
      ownershipPercentage: 30,
      shares: 3000000,
      vestingSchedule: 'Standard 4 years with 1 year cliff',
      companyId: company.id,
      createdAt: new Date()
    };
    this.stakeholders.set(founder2.id, founder2);
    
    const investor: Stakeholder = {
      id: this.currentStakeholderId++,
      name: 'Sunrise Partners',
      email: 'contact@sunrisepartners.vc',
      role: 'Seed Investor',
      equityType: 'Series Seed Preferred',
      ownershipPercentage: 20,
      shares: 2000000,
      vestingSchedule: null,
      companyId: company.id,
      createdAt: new Date()
    };
    this.stakeholders.set(investor.id, investor);
    
    // Create sample financial data
    const finData: FinancialDataType = {
      id: this.currentFinancialDataId++,
      cashBalance: 595000,
      burnRate: 42500,
      revenue: 120000,
      expenses: 162500,
      companyId: company.id,
      createdAt: new Date()
    };
    this.financialData.set(finData.id, finData);
    
    // Create sample token info
    const token: TokenInfo = {
      id: this.currentTokenInfoId++,
      name: 'TechFusion Equity Token',
      symbol: 'TFET',
      contractAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      totalSupply: 10000000,
      network: 'Ethereum Mainnet',
      companyId: company.id,
      createdAt: new Date()
    };
    this.tokenInfos.set(token.id, token);
    
    // Create sample token transfers
    const transfer1: TokenTransfer = {
      id: this.currentTokenTransferId++,
      amount: 500000,
      from: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
      to: '0x7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      tokenId: token.id
    };
    this.tokenTransfers.set(transfer1.id, transfer1);
    
    const transfer2: TokenTransfer = {
      id: this.currentTokenTransferId++,
      amount: 250000,
      from: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      to: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      tokenId: token.id
    };
    this.tokenTransfers.set(transfer2.id, transfer2);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  // Company operations
  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }
  
  async getCompaniesByUserId(userId: number): Promise<Company[]> {
    return Array.from(this.companies.values())
      .filter(company => company.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by createdAt desc
  }
  
  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.currentCompanyId++;
    const company: Company = { 
      ...insertCompany, 
      id,
      founded: new Date(insertCompany.founded),
      createdAt: new Date()
    };
    this.companies.set(id, company);
    return company;
  }
  
  async updateCompanyValuation(id: number, valuation: number): Promise<Company> {
    const company = this.companies.get(id);
    if (!company) {
      throw new Error(`Company with id ${id} not found`);
    }
    
    company.valuation = valuation;
    this.companies.set(id, company);
    return company;
  }
  
  // Stakeholder operations
  async getStakeholder(id: number): Promise<Stakeholder | undefined> {
    return this.stakeholders.get(id);
  }
  
  async getStakeholdersByCompanyId(companyId: number): Promise<Stakeholder[]> {
    return Array.from(this.stakeholders.values())
      .filter(stakeholder => stakeholder.companyId === companyId);
  }
  
  async createStakeholder(insertStakeholder: InsertStakeholder): Promise<Stakeholder> {
    const id = this.currentStakeholderId++;
    const stakeholder: Stakeholder = { 
      ...insertStakeholder, 
      id,
      createdAt: new Date()
    };
    this.stakeholders.set(id, stakeholder);
    return stakeholder;
  }
  
  // Financial data operations
  async getFinancialData(id: number): Promise<FinancialDataType | undefined> {
    return this.financialData.get(id);
  }
  
  async getFinancialDataByCompanyId(companyId: number): Promise<FinancialDataType | undefined> {
    return Array.from(this.financialData.values())
      .find(data => data.companyId === companyId);
  }
  
  async createFinancialData(insertFinancialData: InsertFinancialData): Promise<FinancialDataType> {
    const id = this.currentFinancialDataId++;
    const financialDataEntry: FinancialDataType = { 
      ...insertFinancialData, 
      id,
      createdAt: new Date()
    };
    this.financialData.set(id, financialDataEntry);
    return financialDataEntry;
  }
  
  // Token operations
  async getTokenInfo(id: number): Promise<TokenInfo | undefined> {
    return this.tokenInfos.get(id);
  }
  
  async getTokenInfoByCompanyId(companyId: number): Promise<TokenInfo | undefined> {
    return Array.from(this.tokenInfos.values())
      .find(token => token.companyId === companyId);
  }
  
  async createTokenInfo(insertTokenInfo: InsertTokenInfo): Promise<TokenInfo> {
    const id = this.currentTokenInfoId++;
    const token: TokenInfo = { 
      ...insertTokenInfo, 
      id,
      createdAt: new Date()
    };
    this.tokenInfos.set(id, token);
    return token;
  }
  
  // Token transfer operations
  async getTokenTransfer(id: number): Promise<TokenTransfer | undefined> {
    return this.tokenTransfers.get(id);
  }
  
  async getTokenTransfersByTokenId(tokenId: number): Promise<TokenTransfer[]> {
    return Array.from(this.tokenTransfers.values())
      .filter(transfer => transfer.tokenId === tokenId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort by timestamp desc
  }
  
  async createTokenTransfer(insertTokenTransfer: InsertTokenTransfer): Promise<TokenTransfer> {
    const id = this.currentTokenTransferId++;
    const transfer: TokenTransfer = { 
      ...insertTokenTransfer, 
      id,
      timestamp: new Date()
    };
    this.tokenTransfers.set(id, transfer);
    return transfer;
  }
  
  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }
  
  async getDocumentsByCompanyId(companyId: number): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(document => document.companyId === companyId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by createdAt desc
  }
  
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const document: Document = { 
      ...insertDocument, 
      id,
      signed: false,
      createdAt: new Date()
    };
    this.documents.set(id, document);
    return document;
  }
  
  async updateDocumentSigned(id: number, signed: boolean): Promise<Document> {
    const document = this.documents.get(id);
    if (!document) {
      throw new Error(`Document with id ${id} not found`);
    }
    
    document.signed = signed;
    this.documents.set(id, document);
    return document;
  }
}

export const storage = new MemStorage();
