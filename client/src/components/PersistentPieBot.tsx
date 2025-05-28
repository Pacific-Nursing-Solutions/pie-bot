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
      'Available commands:',
      '  equity split <company>     - Calculate equity distribution',
      '  deploy token <symbol>      - Deploy new company token',
      '  create agreement <type>    - Generate legal documents',
      '  valuation <method>         - Run company valuation',
      '  mint nft <collection>      - Create tokenized asset',
      '  pool create <name>         - Set up investment pool',
      '  debt analyze               - Review debt positions',
      '  ens register <domain>      - Register ENS subdomain',
      '  clear                      - Clear terminal',
      '',
      'Examples:',
      '  > equity split techstart',
      '  > deploy token TSI',
      '  > create agreement founders'
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
    <div className="bg-black text-green-400 font-mono text-sm rounded-lg overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4" />
          <span className="text-gray-300">Pie Bot Command Center</span>
        </div>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 h-96 overflow-y-auto">
        <div className="space-y-1">
          {commandHistory.map((entry, index) => (
            <div key={index} className="flex">
              <span className="text-gray-500 text-xs w-20 shrink-0">{entry.timestamp}</span>
              <span className={`${
                entry.type === 'command' ? 'text-cyan-400' :
                entry.type === 'success' ? 'text-green-400' :
                entry.type === 'error' ? 'text-red-400' :
                'text-gray-300'
              }`}>
                {entry.content}
              </span>
            </div>
          ))}
        </div>

        {/* Current Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center mt-2">
          <span className="text-orange-400 mr-2">pie@terminal:~$</span>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-green-400 border-none outline-none font-mono"
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