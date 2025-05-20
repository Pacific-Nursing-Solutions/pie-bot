import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommandTerminal from '@/components/CommandTerminal';
import CompanyCard from '@/components/CompanyCard';
import RunwayCard from '@/components/RunwayCard';
import EquityVisualization from '@/components/EquityVisualization';
import StakeholdersList from '@/components/StakeholdersList';
import BlockchainIntegration from '@/components/BlockchainIntegration';
import { Company, FinancialData, Stakeholder, EquityDistribution, TokenInfo, TokenTransfer } from '@/types';
import { apiRequest } from '@/lib/queryClient';

const Dashboard = () => {
  const [company, setCompany] = useState<Company>({
    id: 1,
    name: 'TechFusion, Inc.',
    entityType: 'Delaware C Corporation',
    founded: 'January 15, 2023',
    valuation: 4750000,
    authorizedShares: 10000000
  });
  
  const [financialData, setFinancialData] = useState<FinancialData>({
    cashBalance: 595000,
    burnRate: 42500,
    runwayMonths: 14
  });
  
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([
    {
      id: 1,
      name: 'Maria Silva',
      email: 'maria@techfusion.com',
      role: 'CEO & Co-Founder',
      equityType: 'Common Stock',
      ownershipPercentage: 35,
      shares: 3500000,
      avatarInitials: 'MS'
    },
    {
      id: 2,
      name: 'James Kim',
      email: 'james@techfusion.com',
      role: 'CTO & Co-Founder',
      equityType: 'Common Stock',
      ownershipPercentage: 30,
      shares: 3000000,
      avatarInitials: 'JK'
    },
    {
      id: 3,
      name: 'Sunrise Partners',
      email: 'contact@sunrisepartners.vc',
      role: 'Seed Investor',
      equityType: 'Series Seed Preferred',
      ownershipPercentage: 20,
      shares: 2000000,
      avatarInitials: 'SP'
    }
  ]);
  
  const [equityData, setEquityData] = useState<EquityDistribution[]>([
    {
      id: '1',
      name: 'Founders',
      percentage: 65,
      shares: 6500000,
      color: '#3f51b5'
    },
    {
      id: '2',
      name: 'Investors',
      percentage: 20,
      shares: 2000000,
      color: '#4caf50'
    },
    {
      id: '3',
      name: 'Option Pool',
      percentage: 15,
      shares: 1500000,
      color: '#ff9800'
    }
  ]);
  
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    name: 'TechFusion Equity Token',
    symbol: 'TFET',
    contractAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    totalSupply: 10000000,
    network: 'Ethereum Mainnet'
  });
  
  const [recentTransfers, setRecentTransfers] = useState<TokenTransfer[]>([
    {
      id: 1,
      amount: 500000,
      from: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
      to: '0x7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u',
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 // 2 days ago
    },
    {
      id: 2,
      amount: 250000,
      from: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      to: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v',
      timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000 // 5 days ago
    }
  ]);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch company data
        const companyRes = await apiRequest('GET', '/api/companies/current', undefined);
        if (companyRes.ok) {
          const companyData = await companyRes.json();
          setCompany(companyData);
        }
        
        // Fetch financial data
        const financialRes = await apiRequest('GET', '/api/financial/runway', undefined);
        if (financialRes.ok) {
          const financialData = await financialRes.json();
          setFinancialData(financialData);
        }
        
        // Fetch stakeholders
        const stakeholdersRes = await apiRequest('GET', '/api/stakeholders', undefined);
        if (stakeholdersRes.ok) {
          const stakeholdersData = await stakeholdersRes.json();
          setStakeholders(stakeholdersData);
        }
        
        // Fetch equity distribution
        const equityRes = await apiRequest('GET', '/api/equity', undefined);
        if (equityRes.ok) {
          const equityData = await equityRes.json();
          setEquityData(equityData.distribution);
        }
        
        // Fetch token info
        const tokenRes = await apiRequest('GET', '/api/token', undefined);
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          setTokenInfo(tokenData);
          if (tokenData.recentTransfers) {
            setRecentTransfers(tokenData.recentTransfers);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Keep using default state data if API calls fail
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <CommandTerminal />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Company Overview */}
          <div className="col-span-1">
            <CompanyCard company={company} />
            <RunwayCard financialData={financialData} />
          </div>
          
          {/* Middle + Right columns - Equity Visualization */}
          <div className="col-span-1 lg:col-span-2">
            <EquityVisualization 
              equityData={equityData} 
              totalShares={company.authorizedShares} 
            />
            <StakeholdersList stakeholders={stakeholders} />
          </div>
        </div>
        
        <BlockchainIntegration
          tokenInfo={tokenInfo}
          recentTransfers={recentTransfers}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
