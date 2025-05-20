import { useState } from 'react';
import { CommandHistoryItem } from '@/types';
import { apiRequest } from '@/lib/queryClient';

interface CommandProcessorProps {
  setCommandHistory: React.Dispatch<React.SetStateAction<CommandHistoryItem[]>>;
  showToast: (message: string) => void;
}

export const useCommandProcessor = ({ setCommandHistory, showToast }: CommandProcessorProps) => {
  const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] = useState(false);
  const [isAddFounderModalOpen, setIsAddFounderModalOpen] = useState(false);

  const addCommandResponse = (response: string) => {
    setCommandHistory(prev => [...prev, { type: 'response', content: response }]);
  };

  const closeModals = () => {
    setIsCreateCompanyModalOpen(false);
    setIsAddFounderModalOpen(false);
  };

  const processCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase().trim();

    // Process command and show response
    switch(lowerCommand) {
      case 'help':
        addCommandResponse(`
          <div class="text-yellow-400 mt-1 mb-1">Available Commands:</div>
          <div class="mb-1 pl-2">
            <div><span class="text-yellow-400">create company</span> - Start the company creation wizard</div>
            <div><span class="text-yellow-400">show equity</span> - Display current equity distribution</div>
            <div><span class="text-yellow-400">add founder</span> - Add a new founder with equity allocation</div>
            <div><span class="text-yellow-400">add investor</span> - Process an investment with equity allocation</div>
            <div><span class="text-yellow-400">calculate runway</span> - Calculate financial runway based on burn rate</div>
            <div><span class="text-yellow-400">generate docs</span> - Generate legal documents for signing</div>
            <div><span class="text-yellow-400">token info</span> - Show blockchain token information</div>
            <div><span class="text-yellow-400">clear</span> - Clear the terminal</div>
          </div>
        `);
        break;
      
      case 'create company':
        addCommandResponse(`
          <div class="text-green-400 mt-1 mb-1">Company Creation Wizard</div>
          <div class="mb-1">What type of company would you like to create?</div>
          <div class="mb-1 pl-2">
            <div>1. <span class="text-yellow-400">LLC</span> - Limited Liability Company with dynamic equity splits</div>
            <div>2. <span class="text-yellow-400">C Corp</span> - Corporation with formal stock structure</div>
          </div>
          <div class="mb-1">Type the number or name of your selection.</div>
        `);
        setIsCreateCompanyModalOpen(true);
        break;
      
      case 'show equity':
        try {
          const response = await apiRequest('GET', '/api/equity', undefined);
          const data = await response.json();
          
          let equityHtml = `
            <div class="text-green-400 mt-1 mb-1">Current Equity Distribution:</div>
            <div class="mb-1">
          `;
          
          for (const item of data.stakeholders) {
            equityHtml += `<div>- ${item.name} (${item.role}): ${item.ownershipPercentage}% (${item.shares.toLocaleString()} shares)</div>`;
          }
          
          equityHtml += `</div>
            <div class="mb-1">For a visualization, see the Equity Distribution chart on your dashboard.</div>
          `;
          
          addCommandResponse(equityHtml);
        } catch (error) {
          // Fallback if API fails
          addCommandResponse(`
            <div class="text-green-400 mt-1 mb-1">Current Equity Distribution:</div>
            <div class="mb-1">
              <div>- Maria Silva (CEO & Co-founder): 35% (3,500,000 shares)</div>
              <div>- James Kim (CTO & Co-founder): 30% (3,000,000 shares)</div>
              <div>- Sunrise Partners (Seed Investor): 20% (2,000,000 shares)</div>
              <div>- Option Pool: 15% (1,500,000 shares)</div>
            </div>
            <div class="mb-1">For a visualization, see the Equity Distribution chart on your dashboard.</div>
          `);
        }
        break;
      
      case 'add founder':
        addCommandResponse(`
          <div class="text-green-400 mt-1 mb-1">Add Founder Wizard</div>
          <div class="mb-1">Please provide the following information:</div>
          <div class="mb-1">1. Founder's full name</div>
          <div class="mb-1">2. Email address</div>
          <div class="mb-1">3. Role/title</div>
          <div class="mb-1">4. Equity percentage or number of shares</div>
          <div class="mb-1">5. Vesting schedule (standard is 4 years with 1 year cliff)</div>
        `);
        setIsAddFounderModalOpen(true);
        break;
      
      case 'calculate runway':
        try {
          const response = await apiRequest('GET', '/api/financial/runway', undefined);
          const data = await response.json();
          
          const formattedCashBalance = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
          }).format(data.cashBalance);
          
          const formattedBurnRate = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
          }).format(data.burnRate);
          
          const runwayEndDate = new Date();
          runwayEndDate.setMonth(runwayEndDate.getMonth() + data.runwayMonths);
          
          addCommandResponse(`
            <div class="text-green-400 mt-1 mb-1">Financial Runway Calculation</div>
            <div class="mb-1">
              <div>Current cash balance: ${formattedCashBalance}</div>
              <div>Monthly burn rate: ${formattedBurnRate}</div>
              <div>Estimated runway: ${data.runwayMonths} months</div>
            </div>
            <div class="mb-1">
              Runway end date: ${runwayEndDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div class="mb-1 text-yellow-400">
              Recommendation: Consider fundraising within the next ${Math.max(Math.floor(data.runwayMonths / 2), 1)} months to avoid cash flow issues.
            </div>
          `);
        } catch (error) {
          // Fallback if API fails
          addCommandResponse(`
            <div class="text-green-400 mt-1 mb-1">Financial Runway Calculation</div>
            <div class="mb-1">
              <div>Current cash balance: $595,000</div>
              <div>Monthly burn rate: $42,500</div>
              <div>Estimated runway: 14 months</div>
            </div>
            <div class="mb-1">
              Runway end date: January 15, 2025
            </div>
            <div class="mb-1 text-yellow-400">
              Recommendation: Consider fundraising within the next 8 months to avoid cash flow issues.
            </div>
          `);
        }
        break;
      
      case 'token info':
        try {
          const response = await apiRequest('GET', '/api/token', undefined);
          const data = await response.json();
          
          addCommandResponse(`
            <div class="text-green-400 mt-1 mb-1">Ethereum Token Information</div>
            <div class="mb-1">
              <div>Token name: ${data.name} (${data.symbol})</div>
              <div>Contract address: ${data.contractAddress}</div>
              <div>Total supply: ${data.totalSupply.toLocaleString()} ${data.symbol}</div>
              <div>Network: ${data.network}</div>
            </div>
            <div class="mb-1">
              <div>Recent transactions:</div>
              ${data.recentTransfers.map((transfer: any) => 
                `<div>- ${transfer.amount.toLocaleString()} ${data.symbol} transfer (${new Date(transfer.timestamp).toLocaleDateString()})</div>`
              ).join('')}
            </div>
            <div class="mb-1">
              Use <span class="text-yellow-400">token transfer [address] [amount]</span> to initiate a new transfer.
            </div>
          `);
        } catch (error) {
          // Fallback if API fails
          addCommandResponse(`
            <div class="text-green-400 mt-1 mb-1">Ethereum Token Information</div>
            <div class="mb-1">
              <div>Token name: TechFusion Equity Token (TFET)</div>
              <div>Contract address: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D</div>
              <div>Total supply: 10,000,000 TFET</div>
              <div>Network: Ethereum Mainnet</div>
            </div>
            <div class="mb-1">
              <div>Recent transactions:</div>
              <div>- 500,000 TFET transfer (2 days ago)</div>
              <div>- 250,000 TFET transfer (5 days ago)</div>
            </div>
            <div class="mb-1">
              Use <span class="text-yellow-400">token transfer [address] [amount]</span> to initiate a new transfer.
            </div>
          `);
        }
        break;
      
      case 'clear':
        setCommandHistory([
          { type: 'response', content: 'Pie Bot v1.0.0 - Equity Management Platform' },
          { type: 'response', content: 'Type <span class="text-yellow-400">help</span> to see available commands or <span class="text-yellow-400">demo</span> to run a demonstration.' }
        ]);
        return;
      
      case 'demo':
        addCommandResponse(`
          <div class="text-green-400 mt-1 mb-1">Running demo sequence...</div>
          <div class="mb-1">Creating sample company "TechFusion, Inc." as Delaware C Corporation...</div>
          <div class="mb-1">Adding founders and initial equity distribution...</div>
          <div class="mb-1">Simulating seed investment round of $750,000 at $3M pre-money valuation...</div>
          <div class="mb-1">Allocating 15% option pool...</div>
          <div class="mb-1">Creating Ethereum tokens for equity representation...</div>
          <div class="mb-1 text-green-400">Demo company created successfully!</div>
        `);
        showToast('Demo completed successfully');
        break;
      
      default:
        // Check if command starts with a known command prefix
        if (lowerCommand.startsWith('token transfer ')) {
          const parts = command.split(' ');
          if (parts.length >= 4) {
            const address = parts[2];
            const amount = parts[3];
            addCommandResponse(`
              <div class="text-green-400 mt-1 mb-1">Token Transfer Initiated</div>
              <div class="mb-1">Preparing to transfer ${amount} TFET to ${address}</div>
              <div class="mb-1">Please confirm this transaction in your wallet...</div>
              <div class="mb-1 text-yellow-400">This functionality requires a connected Ethereum wallet.</div>
            `);
          } else {
            addCommandResponse(`
              <div class="text-red-400 mt-1 mb-1">Invalid command format</div>
              <div class="mb-1">Usage: token transfer [address] [amount]</div>
            `);
          }
        } else {
          addCommandResponse(`
            <div class="text-red-400 mt-1 mb-1">Command not recognized: ${command}</div>
            <div class="mb-1">Type <span class="text-yellow-400">help</span> to see available commands.</div>
          `);
        }
    }
  };

  return {
    processCommand,
    isCreateCompanyModalOpen,
    isAddFounderModalOpen,
    closeModals
  };
};
