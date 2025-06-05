import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { PieBotLogo } from './PieBotLogo';

interface CommandOutput {
  type: 'command' | 'output' | 'success' | 'error';
  content: string;
  timestamp: string;
}

const CleanPieTerminal = () => {
  const loadHistory = (): CommandOutput[] => {
    // Clear any old cached data with pie emojis
    localStorage.removeItem('pie-bot-history');
    
    return [
      {
        type: 'output',
        content: '[PIEBOT_LOGO] Pie Bot Terminal v1.0.0',
        timestamp: new Date().toLocaleTimeString()
      },
      {
        type: 'output',
        content: 'Type "help" for commands or ask me anything...',
        timestamp: new Date().toLocaleTimeString()
      }
    ];
  };

  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>(loadHistory());
  const [currentInput, setCurrentInput] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('pie-bot-history', JSON.stringify(commandHistory));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }, [commandHistory]);

  const commands = {
    'help': () => [
      '[PIEBOT_LOGO] Available Commands:',
      '',
      '  equity split <company>  - Calculate equity distribution',
      '  valuation <method>      - Run company valuation',
      '  companies               - View companies',
      '  clear                   - Clear terminal',
      '',
      'Ask me about equity, finance, or legal matters!'
    ],
    'clear': () => {
      setCommandHistory([{
        type: 'output',
        content: '[PIEBOT_LOGO] Pie Bot Terminal v1.0',
        timestamp: new Date().toLocaleTimeString()
      }]);
      return [];
    },
    'companies': () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/companies';
      }
      return ['[PIEBOT_LOGO] Opening Companies...'];
    },
    'equity': (args: string[]) => {
      if (args[0] === 'split') {
        return [
          `[PIEBOT_LOGO] Analyzing equity for ${args[1] || 'company'}...`,
          '✓ Calculating distribution',
          '✓ Analyzing vesting schedules',
          'Equity analysis complete!'
        ];
      }
      return ['Usage: equity split <company>'];
    },
    'valuation': (args: string[]) => {
      return [
        `[PIEBOT_LOGO] Running ${args[0] || 'DCF'} valuation...`,
        '✓ Analyzing financials',
        '✓ Calculating metrics',
        'Valuation analysis ready!'
      ];
    }
  };

  const executeCommand = async (command: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const newHistory = [...commandHistory];
    
    newHistory.push({
      type: 'command',
      content: `> ${command}`,
      timestamp
    });

    const [cmd, ...args] = command.toLowerCase().trim().split(' ');
    
    if (cmd === 'clear') {
      setCommandHistory([
        {
          type: 'output',
          content: '[PIEBOT_LOGO] Pie Bot Terminal v1.0',
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
            context: 'You are Pie Bot, an AI assistant for startup equity management.'
          }),
        });

        const updatedHistory = newHistory.slice(0, -1);
        
        if (response.ok) {
          const data = await response.json();
          if (data.error) {
            updatedHistory.push({
              type: 'error',
              content: data.error,
              timestamp
            });
          } else {
            const responseLines = data.response.split('\n').filter((line: string) => line.trim());
            responseLines.forEach((line: string) => {
              updatedHistory.push({
                type: 'output',
                content: line,
                timestamp
              });
            });
          }
        } else {
          updatedHistory.push({
            type: 'error',
            content: `Try specific commands like "help", "equity split", or "valuation".`,
            timestamp
          });
        }
        
        setCommandHistory(updatedHistory);
        return;
      } catch (error) {
        const errorHistory = newHistory.slice(0, -1);
        errorHistory.push({
          type: 'error',
          content: `Network error. Try "help" for available commands.`,
          timestamp
        });
        setCommandHistory(errorHistory);
        return;
      }
    }

    setCommandHistory(newHistory);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;
    
    executeCommand(currentInput);
    setCurrentInput('');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white terminal-font text-xs sm:text-sm overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-gray-50 dark:bg-gray-800 px-3 sm:px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
          <span className="text-gray-900 dark:text-white text-xs sm:text-sm">Pie Bot Terminal v1.0.0</span>
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
            <div key={index} className="flex gap-2">
              <span className="text-gray-600 dark:text-gray-100 text-xs w-20 shrink-0">{entry.timestamp}</span>
              <span className={`flex items-center gap-1 ${
                entry.type === 'command' ? 'text-blue-600' :
                entry.type === 'success' ? 'text-orange-500' :
                entry.type === 'error' ? 'text-red-500' :
                'text-gray-900 dark:text-white'
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
          <span className="terminal-prompt mr-2 text-gray-900 dark:text-white">pie.bot:~$</span>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Enter command..."
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
};

export default CleanPieTerminal;