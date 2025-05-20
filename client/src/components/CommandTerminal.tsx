import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CommandHistoryItem } from '@/types';
import { useCommandProcessor } from '@/hooks/use-command-processor';
import CreateCompanyModal from './modals/CreateCompanyModal';
import AddFounderModal from './modals/AddFounderModal';

const CommandTerminal = () => {
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([
    { type: 'response', content: 'Pie Bot v1.0.0 - Equity Management Platform' },
    { type: 'response', content: 'Type <span class="text-yellow-400">help</span> to see available commands or <span class="text-yellow-400">demo</span> to run a demonstration.' }
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const { toast } = useToast();
  const { processCommand, isCreateCompanyModalOpen, isAddFounderModalOpen, closeModals } = useCommandProcessor({ 
    setCommandHistory, 
    showToast: (message) => toast({ description: message }) 
  });

  // Auto-scroll to bottom when command history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  // Focus input when terminal is clicked
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commandInput.trim()) {
      // Add to history
      const newCommandHistory = [...commandHistory, { type: 'command', content: commandInput }];
      setCommandHistory(newCommandHistory);
      
      // Process the command
      processCommand(commandInput);
      
      // Add to input history
      setInputHistory([commandInput, ...inputHistory]);
      setHistoryIndex(-1);
      
      // Clear input
      setCommandInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < inputHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommandInput(inputHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommandInput(inputHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput('');
      }
    }
  };

  const clearTerminal = () => {
    setCommandHistory([
      { type: 'response', content: 'Pie Bot v1.0.0 - Equity Management Platform' },
      { type: 'response', content: 'Type <span class="text-yellow-400">help</span> to see available commands or <span class="text-yellow-400">demo</span> to run a demonstration.' }
    ]);
  };

  const copyTerminalContent = () => {
    const plainText = commandHistory
      .map(item => {
        if (item.type === 'command') {
          return `$ ${item.content}`;
        } else {
          // Remove HTML tags for plain text
          return item.content.replace(/<[^>]*>/g, '');
        }
      })
      .join('\n');
    
    navigator.clipboard.writeText(plainText);
    toast({ description: "Terminal content copied to clipboard" });
  };

  return (
    <section className="mb-8">
      <div className="bg-white dark:bg-[#293145] rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-primary text-white flex justify-between items-center">
          <h2 className="font-semibold">Command Terminal</h2>
          <div className="flex items-center space-x-2">
            <button 
              className="p-1 hover:bg-primary-light rounded" 
              title="Clear terminal"
              onClick={clearTerminal}
            >
              <span className="material-icons text-sm">delete</span>
            </button>
            <button 
              className="p-1 hover:bg-primary-light rounded" 
              title="Copy to clipboard"
              onClick={copyTerminalContent}
            >
              <span className="material-icons text-sm">content_copy</span>
            </button>
            <button 
              className="p-1 hover:bg-primary-light rounded" 
              title="Maximize"
            >
              <span className="material-icons text-sm">open_in_full</span>
            </button>
          </div>
        </div>
        
        <div className="terminal p-4" ref={terminalRef} onClick={focusInput}>
          <div className="terminal-history">
            {commandHistory.map((item, index) => (
              <div key={index} className="mb-1">
                {item.type === 'command' ? (
                  <div>
                    <span className="text-green-400 mr-2">$</span>
                    <span className="text-white">{item.content}</span>
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                )}
              </div>
            ))}
          </div>
          
          <form onSubmit={handleCommandSubmit} className="flex items-start mt-2">
            <span className="text-green-400 mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              className="command-input flex-grow bg-transparent border-none focus:ring-0"
              placeholder="Enter command..."
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
          </form>
        </div>
        
        {/* Command suggestions */}
        <div className="bg-[#1c2333] border-t border-gray-700 px-4 py-2 text-sm">
          <div className="text-gray-400 mb-1">Suggested commands:</div>
          <div className="flex flex-wrap gap-2">
            <button
              className="suggestion px-2 py-1 rounded text-yellow-400 hover:bg-gray-800"
              onClick={() => setCommandInput('create company')}
            >
              create company
            </button>
            <button
              className="suggestion px-2 py-1 rounded text-yellow-400 hover:bg-gray-800"
              onClick={() => setCommandInput('show equity')}
            >
              show equity
            </button>
            <button
              className="suggestion px-2 py-1 rounded text-yellow-400 hover:bg-gray-800"
              onClick={() => setCommandInput('add founder')}
            >
              add founder
            </button>
            <button
              className="suggestion px-2 py-1 rounded text-yellow-400 hover:bg-gray-800"
              onClick={() => setCommandInput('calculate runway')}
            >
              calculate runway
            </button>
            <button
              className="suggestion px-2 py-1 rounded text-yellow-400 hover:bg-gray-800"
              onClick={() => setCommandInput('help')}
            >
              help
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateCompanyModal
        isOpen={isCreateCompanyModalOpen}
        onClose={closeModals}
      />
      <AddFounderModal
        isOpen={isAddFounderModalOpen}
        onClose={closeModals}
      />
    </section>
  );
};

export default CommandTerminal;
