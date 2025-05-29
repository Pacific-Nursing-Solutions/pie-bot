import { useState, useEffect } from 'react';
import { Terminal, ChevronRight, ArrowUp } from 'lucide-react';

interface CommandOutput {
  type: 'command' | 'output' | 'success' | 'error';
  content: string;
  timestamp: string;
}

const PieTerminal = () => {
  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>([
    {
      type: 'output',
      content: '🥧 Pie Bot Terminal v2.1.0 - Equity Command Center',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      type: 'output',
      content: 'Type "help" for available commands or start typing...',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);

  const commands = {
    'help': () => [
      '🥧 PIE BOT COMMAND CENTER - Available Operations:',
      '',
      'EQUITY & LEGAL:',
      '  equity split <company>     - Calculate equity distribution',
      '  create agreement <type>    - Generate legal documents',
      '  valuation <method>         - Run company valuation',
      '',
      'BLOCKCHAIN & TOKENS:',
      '  deploy token <symbol>      - Deploy ERC-20 smart contract',
      '  mint nft <collection>      - Create tokenized NFT assets',
      '  ens register <domain>      - Register ENS subdomains',
      '',
      'FINANCIAL OPERATIONS:',
      '  debt analyze               - Review all debt positions',
      '  fund <company>             - Initiate fundraising process',
      '  pool create <name>         - Set up investment pools',
      '  generate report <type>     - Create financial reports',
      '',
      'SYSTEM:',
      '  clear                      - Clear terminal history',
      '  help                       - Show this command list',
      '',
      'Examples:',
      '  > equity split techstart',
      '  > deploy token TSI',
      '  > mint nft company-assets',
      '  > debt analyze',
      '  > fund techstart',
      '',
      'Type any command to control your equity ecosystem!'
    ],
    'clear': () => {
      setCommandHistory([{
        type: 'output',
        content: '🥧 Pie Bot Terminal v2.1.0 - Equity Command Center',
        timestamp: new Date().toLocaleTimeString()
      }]);
      return [];
    },
    'equity': (args: string[]) => {
      if (args[0] === 'split') {
        return [
          `🥧 Analyzing equity split for ${args[1] || 'company'}...`,
          '✓ Processing cap table data',
          '✓ Calculating vesting schedules',
          '✓ Applying contribution multipliers',
          '',
          'Equity Distribution:',
          '  Founder A: 45.2% (750,000 shares)',
          '  Founder B: 32.8% (546,667 shares)',
          '  Employee Pool: 15.0% (250,000 shares)',
          '  Investor Reserve: 7.0% (116,667 shares)',
          '',
          'Total: 1,663,334 shares issued'
        ];
      }
      return ['Usage: equity split <company>'];
    },
    'deploy': (args: string[]) => {
      if (args[0] === 'token') {
        return [
          `🥧 Deploying ERC-20 token ${args[1] || 'TOKEN'}...`,
          '✓ Compiling smart contract',
          '✓ Deploying to Base network',
          '✓ Verifying contract on Basescan',
          '',
          `Contract deployed: 0x742d35Cc6334C45532C867b86b8c8E111234567F`,
          `Token Symbol: ${args[1] || 'TOKEN'}`,
          'Initial Supply: 1,000,000 tokens',
          '',
          '✓ Token deployment complete!'
        ];
      }
      return ['Usage: deploy token <symbol>'];
    },
    'create': (args: string[]) => {
      if (args[0] === 'agreement') {
        return [
          `🥧 Generating ${args[1] || 'founders'} agreement...`,
          '✓ Fetching company data',
          '✓ Applying Delaware corporate law',
          '✓ Generating document templates',
          '✓ Calculating equity percentages',
          '',
          'Documents created:',
          '  • Founders Agreement.pdf',
          '  • Equity Grant Letters (2)',
          '  • Vesting Schedule.pdf',
          '',
          '✓ Ready for DocuSign workflow'
        ];
      }
      return ['Usage: create agreement <type>'];
    },
    'valuation': (args: string[]) => {
      return [
        `🥧 Running ${args[0] || 'DCF'} valuation analysis...`,
        '✓ Gathering financial data',
        '✓ Analyzing market comparables',
        '✓ Calculating risk factors',
        '',
        'Valuation Results:',
        '  DCF Method: $8.2M',
        '  Market Multiple: $7.8M',
        '  Risk-Adjusted: $7.5M',
        '',
        '✓ Recommended valuation: $7.8M'
      ];
    },
    'mint': (args: string[]) => {
      if (args[0] === 'nft') {
        return [
          `🥧 Minting NFT for ${args[1] || 'collection'}...`,
          '✓ Uploading metadata to IPFS',
          '✓ Deploying ERC-721 contract',
          '✓ Configuring royalties (2.5%)',
          '✓ Setting up tokenized ownership',
          '',
          `NFT Contract: 0x89Ab32156e46F15F507a5573c72681eD1616634`,
          `Collection: ${args[1] || 'collection'}`,
          'Shares: 1,000 tokens (tradeable)',
          '',
          '✓ NFT ready for fractional ownership!'
        ];
      }
      return ['Usage: mint nft <collection>'];
    },
    'pool': (args: string[]) => {
      if (args[0] === 'create') {
        return [
          `🥧 Creating investment pool "${args[1] || 'pool'}"...`,
          '✓ Setting up pool smart contract',
          '✓ Configuring governance rules',
          '✓ Establishing fee structure (2/20)',
          '✓ Creating LP tokens',
          '',
          `Pool Address: 0x1234567890abcdef1234567890abcdef12345678`,
          `Pool Name: ${args[1] || 'pool'}`,
          'Min Investment: $10,000',
          'Max Pool Size: $5,000,000',
          '',
          '✓ Pool ready for investments!'
        ];
      }
      return ['Usage: pool create <name>'];
    },
    'debt': (args: string[]) => {
      if (args[0] === 'analyze') {
        return [
          '🥧 Analyzing debt positions...',
          '✓ Scanning personal wallet',
          '✓ Reviewing company positions',
          '✓ Checking DeFi protocols',
          '',
          'Personal Debt Summary:',
          '  Aave ETH Loan: $45K (3.2% APR)',
          '  Compound USDC: $12K (2.8% APR)',
          '  MakerDAO Vault: $28K (5.5% APR)',
          '',
          'Company Debt Summary:',
          '  Bridge Loan: $300K (7.5% APR)',
          '  DeFi Position: $150K (4.2% APR)',
          '',
          '⚠️  MakerDAO vault approaching liquidation',
          '✓ Recommend adding $5K collateral'
        ];
      }
      return ['Usage: debt analyze'];
    },
    'ens': (args: string[]) => {
      if (args[0] === 'register') {
        return [
          `🥧 Registering ENS domain "${args[1] || 'subdomain'}.founder.eth"...`,
          '✓ Checking domain availability',
          '✓ Calculating registration fees',
          '✓ Submitting ENS transaction',
          '✓ Configuring DNS records',
          '',
          `Domain: ${args[1] || 'subdomain'}.founder.eth`,
          'Registration Period: 1 year',
          'Total Cost: 0.003 ETH',
          '',
          '✓ ENS domain registered successfully!'
        ];
      }
      return ['Usage: ens register <subdomain>'];
    },
    'fund': (args: string[]) => {
      return [
        `🥧 Initiating fundraising for ${args[0] || 'company'}...`,
        '✓ Preparing pitch deck',
        '✓ Updating cap table',
        '✓ Generating legal documents',
        '✓ Setting up data room',
        '',
        'Fundraising Package:',
        '  Target: $2M Series A',
        '  Valuation: $8M pre-money',
        '  Use of funds: Product development (60%)',
        '                Marketing (25%), Operations (15%)',
        '',
        '✓ Ready to connect with investors!'
      ];
    },
    'generate': (args: string[]) => {
      if (args[0] === 'report') {
        return [
          `🥧 Generating ${args[1] || 'financial'} report...`,
          '✓ Compiling portfolio data',
          '✓ Calculating performance metrics',
          '✓ Creating visualizations',
          '✓ Formatting for export',
          '',
          'Report Contents:',
          '  Portfolio Performance: +23.4% YTD',
          '  Equity Positions: 2 companies',
          '  Pool Returns: $212K total',
          '  Risk Analysis: Moderate',
          '',
          '✓ Report exported to reports/portfolio-2024.pdf'
        ];
      }
      return ['Usage: generate report <type>'];
    }
  };

  const executeCommand = (command: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const newHistory = [...commandHistory];
    
    // Add the command to history
    newHistory.push({
      type: 'command',
      content: `> ${command}`,
      timestamp
    });

    const [cmd, ...args] = command.toLowerCase().split(' ');
    
    if (commands[cmd as keyof typeof commands]) {
      const output = commands[cmd as keyof typeof commands](args);
      if (Array.isArray(output)) {
        output.forEach(line => {
          newHistory.push({
            type: line.startsWith('✓') ? 'success' : 'output',
            content: line,
            timestamp
          });
        });
      }
    } else if (command.trim()) {
      newHistory.push({
        type: 'error',
        content: `Command not found: ${cmd}. Type "help" for available commands.`,
        timestamp
      });
    }

    setCommandHistory(newHistory);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;
    
    executeCommand(currentInput);
    setCurrentInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const commandsOnly = commandHistory.filter(h => h.type === 'command');
      if (commandsOnly.length === 0) return;

      let newIndex = historyIndex;
      if (e.key === 'ArrowUp') {
        newIndex = historyIndex >= commandsOnly.length - 1 ? commandsOnly.length - 1 : historyIndex + 1;
      } else {
        newIndex = historyIndex <= 0 ? -1 : historyIndex - 1;
      }

      setHistoryIndex(newIndex);
      if (newIndex >= 0) {
        setCurrentInput(commandsOnly[commandsOnly.length - 1 - newIndex].content.replace('> ', ''));
      } else {
        setCurrentInput('');
      }
    }
  };

  return (
    <div className="bg-slate-800 text-emerald-300 font-mono text-sm rounded-lg overflow-hidden shadow-xl">
      {/* Terminal Header */}
      <div className="bg-slate-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-slate-300" />
          <span className="text-slate-200">Pie Bot Command Center</span>
        </div>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-rose-400 rounded-full"></div>
          <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
          <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 h-96 overflow-y-auto">
        <div className="space-y-1">
          {commandHistory.map((entry, index) => (
            <div key={index} className="flex">
              <span className="text-slate-400 text-xs w-20 shrink-0">{entry.timestamp}</span>
              <span className={`${
                entry.type === 'command' ? 'text-sky-300' :
                entry.type === 'success' ? 'text-emerald-300' :
                entry.type === 'error' ? 'text-rose-300' :
                'text-slate-200'
              }`}>
                {entry.content}
              </span>
            </div>
          ))}
        </div>

        {/* Current Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center mt-2">
          <span className="text-amber-300 mr-2">pie@terminal:~$</span>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-emerald-300 border-none outline-none font-mono placeholder-slate-500"
            placeholder="Enter command..."
            autoFocus
          />
          <button type="submit" className="hidden">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PieTerminal;