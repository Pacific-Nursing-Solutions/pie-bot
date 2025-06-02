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
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Company operations
  getCompany(id: number): Promise<Company | undefined>;
  getCompaniesByUserId(userId: number): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompanyValuation(id: number, valuation: string): Promise<Company>;
  
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

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || undefined;
  }

  async getCompaniesByUserId(userId: number): Promise<Company[]> {
    return await db.select().from(companies).where(eq(companies.userId, userId));
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const [company] = await db
      .insert(companies)
      .values(insertCompany)
      .returning();
    return company;
  }

  async updateCompanyValuation(id: number, valuation: number): Promise<Company> {
    const [company] = await db
      .update(companies)
      .set({ valuation: valuation.toString() })
      .where(eq(companies.id, id))
      .returning();
    return company;
  }

  async getStakeholder(id: number): Promise<Stakeholder | undefined> {
    const [stakeholder] = await db.select().from(stakeholders).where(eq(stakeholders.id, id));
    return stakeholder || undefined;
  }

  async getStakeholdersByCompanyId(companyId: number): Promise<Stakeholder[]> {
    return await db.select().from(stakeholders).where(eq(stakeholders.companyId, companyId));
  }

  async createStakeholder(insertStakeholder: InsertStakeholder): Promise<Stakeholder> {
    const [stakeholder] = await db
      .insert(stakeholders)
      .values(insertStakeholder)
      .returning();
    return stakeholder;
  }

  async getFinancialData(id: number): Promise<FinancialDataType | undefined> {
    const [data] = await db.select().from(financialData).where(eq(financialData.id, id));
    return data || undefined;
  }

  async getFinancialDataByCompanyId(companyId: number): Promise<FinancialDataType | undefined> {
    const [data] = await db.select().from(financialData).where(eq(financialData.companyId, companyId));
    return data || undefined;
  }

  async createFinancialData(insertFinancialData: InsertFinancialData): Promise<FinancialDataType> {
    const [data] = await db
      .insert(financialData)
      .values(insertFinancialData)
      .returning();
    return data;
  }

  async getTokenInfo(id: number): Promise<TokenInfo | undefined> {
    const [token] = await db.select().from(tokenInfo).where(eq(tokenInfo.id, id));
    return token || undefined;
  }

  async getTokenInfoByCompanyId(companyId: number): Promise<TokenInfo | undefined> {
    const [token] = await db.select().from(tokenInfo).where(eq(tokenInfo.companyId, companyId));
    return token || undefined;
  }

  async createTokenInfo(insertTokenInfo: InsertTokenInfo): Promise<TokenInfo> {
    const [token] = await db
      .insert(tokenInfo)
      .values(insertTokenInfo)
      .returning();
    return token;
  }

  async getTokenTransfer(id: number): Promise<TokenTransfer | undefined> {
    const [transfer] = await db.select().from(tokenTransfers).where(eq(tokenTransfers.id, id));
    return transfer || undefined;
  }

  async getTokenTransfersByTokenId(tokenId: number): Promise<TokenTransfer[]> {
    return await db.select().from(tokenTransfers).where(eq(tokenTransfers.tokenId, tokenId));
  }

  async createTokenTransfer(insertTokenTransfer: InsertTokenTransfer): Promise<TokenTransfer> {
    const [transfer] = await db
      .insert(tokenTransfers)
      .values(insertTokenTransfer)
      .returning();
    return transfer;
  }

  async getDocument(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document || undefined;
  }

  async getDocumentsByCompanyId(companyId: number): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.companyId, companyId));
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db
      .insert(documents)
      .values(insertDocument)
      .returning();
    return document;
  }

  async updateDocumentSigned(id: number, signed: boolean): Promise<Document> {
    const [document] = await db
      .update(documents)
      .set({ signed })
      .where(eq(documents.id, id))
      .returning();
    return document;
  }
}

export const storage = new DatabaseStorage();