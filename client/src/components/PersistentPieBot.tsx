import { useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare, X, Send, Maximize2, Minimize2 } from "lucide-react";
import { useLocation } from "wouter";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type PieBotState = 'integrated' | 'chatbot' | 'minimized';

interface PersistentPieBotProps {
  defaultState?: PieBotState;
}

export default function PersistentPieBot({ defaultState }: PersistentPieBotProps) {
  const [location] = useLocation();
  const isMainPage = location === '/';
  
  const [botState, setBotState] = useState<PieBotState>(
    defaultState || (isMainPage ? 'integrated' : 'chatbot')
  );
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Pie Bot, your equity management assistant. I can help you with company formation, equity splits, token management, and financial planning. What can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          context: 'equity_management'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botResponse: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. As your equity management assistant, I'm designed to help with company formation, equity splits, token management, and financial planning. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getContainerClasses = () => {
    switch (botState) {
      case 'integrated':
        return isMainPage 
          ? 'relative w-full bg-white dark:bg-gray-800 rounded-lg shadow mb-8' 
          : 'fixed bottom-4 right-4 z-50 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700';
      case 'chatbot':
        return 'fixed bottom-4 right-4 z-50 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700';
      case 'minimized':
        return 'fixed bottom-4 right-4 z-50 w-80 h-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700';
      default:
        return 'fixed bottom-4 right-4 z-50 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700';
    }
  };

  const getMessageHeight = () => {
    switch (botState) {
      case 'integrated':
        return isMainPage ? 'h-96' : 'h-64';
      case 'chatbot':
        return 'h-80';
      case 'minimized':
        return 'h-0';
      default:
        return 'h-80';
    }
  };

  const nextState = () => {
    switch (botState) {
      case 'minimized':
        setBotState('chatbot');
        break;
      case 'chatbot':
        setBotState(isMainPage ? 'integrated' : 'minimized');
        break;
      case 'integrated':
        setBotState('chatbot');
        break;
    }
  };

  const getStateIcon = () => {
    switch (botState) {
      case 'minimized':
        return <ChevronUp className="w-4 h-4" />;
      case 'chatbot':
        return isMainPage ? <Maximize2 className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
      case 'integrated':
        return <Minimize2 className="w-4 h-4" />;
    }
  };

  const getStateLabel = () => {
    switch (botState) {
      case 'minimized':
        return "Click to expand";
      case 'chatbot':
        return "Your equity assistant";
      case 'integrated':
        return "Integrated mode";
    }
  };

  return (
    <div className={getContainerClasses()}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm font-bold">🥧</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Pie Bot</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getStateLabel()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {botState !== 'minimized' && (
            <button
              onClick={() => setBotState('minimized')}
              className="p-1 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              title="Minimize"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={nextState}
            className="p-1 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            title={botState === 'minimized' ? 'Expand' : botState === 'chatbot' ? (isMainPage ? 'Integrate' : 'Minimize') : 'Chatbot mode'}
          >
            {getStateIcon()}
          </button>
        </div>
      </div>

      {/* Content */}
      {botState !== 'minimized' && (
        <>
          {/* Messages */}
          <div className={`flex-1 p-4 overflow-y-auto ${getMessageHeight()} space-y-3`}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about equity, tokens, or company management..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}