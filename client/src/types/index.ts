export interface Company {
  id: number;
  name: string;
  entityType: string;
  founded: string;
  valuation: number;
  authorizedShares: number;
}

export interface FinancialData {
  cashBalance: number;
  burnRate: number;
  runwayMonths: number;
}

export interface Stakeholder {
  id: number;
  name: string;
  email: string;
  role: string;
  equityType: string;
  ownershipPercentage: number;
  shares: number;
  avatarInitials: string;
}

export interface EquityDistribution {
  id: string;
  name: string;
  percentage: number;
  shares: number;
  color: string;
}

export interface TokenInfo {
  name: string;
  symbol: string;
  contractAddress: string;
  totalSupply: number;
  network: string;
}

export interface TokenTransfer {
  id: number;
  amount: number;
  from: string;
  to: string;
  timestamp: number;
}

export interface CommandHistoryItem {
  type: 'command' | 'response';
  content: string;
}
