import { useState, useEffect } from 'react';
import { Terminal, ChevronRight, ArrowUp } from 'lucide-react';
import { PieBotLogo } from './PieBotLogo';

interface CommandOutput {
  type: 'command' | 'output' | 'success' | 'error';
  content: string;
  timestamp: string;
}

const PieTerminal = () => {
  // Load command history from localStorage
  const loadHistory = (): CommandOutput[] => {
    try {
      const saved = localStorage.getItem('pie-bot-history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
    return [
      {
        type: 'output',
        content: '💼 Pie Bot Terminal v0.0.1',
        timestamp: new Date().toLocaleTimeString()
      },
      {
        type: 'output',
        content: 'Type "help" for available commands or start typing...',
        timestamp: new Date().toLocaleTimeString()
      }
    ];
  };

  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>(loadHistory());
  const [currentInput, setCurrentInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Save command history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('pie-bot-history', JSON.stringify(commandHistory));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }, [commandHistory]);

  const commands = {
    'help': () => [
      '💼 PIE BOT COMMAND CENTER - Available Operations:',
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
      'NAVIGATION:',
      '  companies                  - View and manage companies',
      '  documents                  - Access document management',
      '  settings                   - Open application settings',
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
        content: '[PIEBOT_LOGO] Pie Bot Terminal v2.1.0 - Equity Command Center',
        timestamp: new Date().toLocaleTimeString()
      }]);
      return [];
    },
    'companies': () => {
      // Navigate to companies page
      if (typeof window !== 'undefined') {
        window.location.href = '/companies';
      }
      return [
        '[PIEBOT_LOGO] Opening Companies Management...',
        '✓ Redirecting to company dashboard',
        '✓ Loading cap table data',
        '✓ Fetching equity structures'
      ];
    },
    'documents': () => {
      // Navigate to documents page
      if (typeof window !== 'undefined') {
        window.location.href = '/documents';
      }
      return [
        '[PIEBOT_LOGO] Opening Document Center...',
        '✓ Accessing legal documents',
        '✓ Loading agreement templates',
        '✓ Connecting to DocuSign workflow'
      ];
    },
    'settings': () => {
      // Navigate to settings page
      if (typeof window !== 'undefined') {
        window.location.href = '/settings';
      }
      return [
        '[PIEBOT_LOGO] Opening Application Settings...',
        '✓ Loading user preferences',
        '✓ Checking security settings',
        '✓ Initializing configuration panel'
      ];
    },
    'equity': (args: string[]) => {
      if (args[0] === 'split') {
        return [
          `[PIEBOT_LOGO] Analyzing equity split for ${args[1] || 'company'}...`,
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
          `[PIEBOT_LOGO] Deploying ERC-20 token ${args[1] || 'TOKEN'}...`,
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
          `[PIEBOT_LOGO] Generating ${args[1] || 'founders'} agreement...`,
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
        `[PIEBOT_LOGO] Running ${args[0] || 'DCF'} valuation analysis...`,
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
          `[PIEBOT_LOGO] Minting NFT for ${args[1] || 'collection'}...`,
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
          `[PIEBOT_LOGO] Creating investment pool "${args[1] || 'pool'}"...`,
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
          '[PIEBOT_LOGO] Analyzing debt positions...',
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
          `[PIEBOT_LOGO] Registering ENS domain "${args[1] || 'subdomain'}.founder.eth"...`,
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
        `[PIEBOT_LOGO] Initiating fundraising for ${args[0] || 'company'}...`,
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
          `[PIEBOT_LOGO] Generating ${args[1] || 'financial'} report...`,
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

  const executeCommand = async (command: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const newHistory = [...commandHistory];
    
    // Add the command to history
    newHistory.push({
      type: 'command',
      content: `> ${command}`,
      timestamp
    });

    const [cmd, ...args] = command.toLowerCase().split(' ');
    
    if (cmd === 'clear') {
      setCommandHistory([
        {
          type: 'output',
          content: '[PIEBOT_LOGO] Pie Bot Terminal v0.0.1',
          timestamp: new Date().toLocaleTimeString()
        },
        {
          type: 'output',
          content: 'Type "help" for available commands or ask me anything...',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      return;
    }
    
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
      // Use OpenAI for natural language queries
      try {
        newHistory.push({
          type: 'output',
          content: '[PIEBOT_LOGO] Thinking...',
          timestamp
        });
        setCommandHistory([...newHistory]);

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: command,
            context: 'You are Pie Bot, an AI assistant specialized in startup equity management, legal processes, blockchain/Web3 integration, and financial operations. RESPONSE STYLE: Keep responses concise and direct. Answer only what was asked. Use 1-3 sentences maximum for most questions. Be practical and actionable.'
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Remove the "thinking" message
          const updatedHistory = newHistory.slice(0, -1);
          
          if (data.error) {
            updatedHistory.push({
              type: 'error',
              content: data.error,
              timestamp
            });
          } else {
            // Split response into lines for better formatting
            const responseLines = data.response.split('\n').filter((line: string) => line.trim());
            responseLines.forEach((line: string) => {
              updatedHistory.push({
                type: 'output',
                content: line,
                timestamp
              });
            });
          }
          
          setCommandHistory(updatedHistory);
        } else {
          const errorData = await response.json().catch(() => ({}));
          const errorHistory = newHistory.slice(0, -1);
          errorHistory.push({
            type: 'error',
            content: errorData.error || `Sorry, I'm having trouble connecting to my AI brain right now. Try specific commands like "help", "equity split", or "valuation".`,
            timestamp
          });
          setCommandHistory(errorHistory);
        }
      } catch (error) {
        const errorHistory = newHistory.slice(0, -1);
        errorHistory.push({
          type: 'error',
          content: `Network error. Try specific commands like "help", "equity split", or "valuation".`,
          timestamp
        });
        setCommandHistory(errorHistory);
      }
    }

    if (command.trim() && !commands[cmd as keyof typeof commands] && cmd !== 'clear') {
      // Don't set history here as it's handled in the OpenAI block above
      return;
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
    <div className="bg-gray-800 text-white terminal-font text-xs sm:text-sm rounded-lg overflow-hidden shadow-xl">
      {/* Terminal Header */}
      <div className="bg-gray-800 px-3 sm:px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
          <span className="text-white text-xs sm:text-sm">Pie Bot Terminal v0.0.1</span>
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-orange-500"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-600"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-orange-500"></div>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        className="p-3 sm:p-4 h-64 sm:h-96 overflow-y-auto cursor-text"
        onClick={() => {
          const input = document.querySelector('input[placeholder="Enter command..."]') as HTMLInputElement;
          if (input) input.focus();
        }}
      >
        <div className="space-y-1">
          {commandHistory.map((entry, index) => (
            <div key={index} className="flex">
              <span className="text-gray-100 text-xs w-20 shrink-0">{entry.timestamp}</span>
              <span className={`flex items-center gap-1 ${
                entry.type === 'command' ? 'text-blue-600' :
                entry.type === 'success' ? 'text-orange-500' :
                entry.type === 'error' ? 'text-orange-500' :
                'text-white'
              }`}>
                {entry.content.includes('[PIEBOT_LOGO]') ? (
                  <>
                    <PieBotLogo size={12} className="inline" />
                    {entry.content.replace('[PIEBOT_LOGO]', '')}
                  </>
                ) : (
                  entry.content
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Current Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center mt-2">
          <span className="terminal-prompt mr-2">pie.bot:~$</span>
          <input
            ref={(input) => {
              if (input) {
                // Store reference for clicking functionality
                (window as any).pieTerminalInput = input;
                // Store submit function globally
                (window as any).pieTerminalSubmit = (command: string) => {
                  setCurrentInput(command);
                  executeCommand(command);
                  setCurrentInput('');
                  setHistoryIndex(-1);
                };
              }
            }}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white border-none outline-none terminal-font placeholder-gray-100"
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