import { useState } from 'react';
import openai from '@/lib/openai';
import EquityConfigurationPanel, { EquityConfiguration, EquitySplit } from './EquityConfiguration';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Sample responses for common equity questions (fallback if API fails)
const sampleResponses: Record<string, string> = {
  'default': "I'm Pie Bot, your equity management assistant. I can help with understanding equity concepts, valuation methods, and financial planning for startups. What specific question do you have?",
  'equity': "When distributing equity among founders, consider these key principles:\n\n1. Fair allocation based on contributions (past and future)\n2. Vesting schedules (typically 4 years with a 1-year cliff)\n3. Clear documentation of ownership\n4. Reserve 10-20% for future employees (option pool)\n\nThe most common split for 2 equal co-founders would be 45-45 with 10% reserved for employees.",
  'valuation': "Startup valuation methods include:\n\n1. Comparable analysis - Looking at similar companies that have raised funding\n2. Discounted Cash Flow (DCF) - Less common for early-stage companies\n3. Berkus method - Assigns value to achievements like prototype, team quality\n4. Venture Capital method - Based on expected exit value\n\nPre-revenue startups often use the comparable approach or raise via convertible notes/SAFEs without fixed valuations.",
  'vesting': "Vesting schedules control when founders and employees earn their equity over time. The standard is 4 years with a 1-year cliff, meaning:\n\n- No equity is earned until 1 year (the cliff)\n- At the 1-year mark, 25% vests immediately\n- The remaining 75% vests monthly or quarterly over 3 more years\n\nThis protects companies if someone leaves early while rewarding long-term commitment.",
  'runway': "To calculate your startup's runway:\n\n1. Add up all cash/liquid assets\n2. Calculate monthly burn rate (expenses minus revenue)\n3. Divide cash by monthly burn rate\n\nFor example: $500,000 cash ÷ $50,000 monthly burn = 10 months runway\n\nIt's advisable to maintain at least 12-18 months of runway and start fundraising when you have 6-9 months remaining.",
  'cap table': "A cap table (capitalization table) tracks ownership percentages, equity types, and dilution over funding rounds. Essential components include:\n\n1. Common stock (typically held by founders/employees)\n2. Preferred stock (investors with special rights)\n3. Option pool (reserved for future employees)\n4. Convertible securities (notes, SAFEs)\n\nMaintain your cap table meticulously with each equity grant or funding round."
};

// Function to find the most relevant response based on keywords
const findResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  
  // Check for keyword matches
  if (lowercaseInput.includes('equity') && (lowercaseInput.includes('distribute') || lowercaseInput.includes('split'))) {
    return sampleResponses['equity'];
  } else if (lowercaseInput.includes('valuation') || lowercaseInput.includes('value') || lowercaseInput.includes('worth')) {
    return sampleResponses['valuation'];
  } else if (lowercaseInput.includes('vesting') || lowercaseInput.includes('schedule')) {
    return sampleResponses['vesting'];
  } else if (lowercaseInput.includes('runway') || lowercaseInput.includes('burn rate')) {
    return sampleResponses['runway'];
  } else if (lowercaseInput.includes('cap table') || lowercaseInput.includes('capitalization')) {
    return sampleResponses['cap table'];
  }
  
  // Default response
  return "I understand you're asking about " + input.split(' ').slice(0, 3).join(' ') + "... To provide better equity management guidance, I'd need to connect to my AI knowledge base. For now, I can answer basic questions about equity distribution, valuations, vesting schedules, and runway calculations.";
};

const SimplePieBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Welcome to Pie Bot! I\'m a legal expert in entity creation and dynamic equity management. Here\'s what I can help you with:\n\n• Draft founders\' agreements and promissory notes customized to your specific needs\n• Recognize and track capital and debt contributions for equity calculations\n• Suggest additional legal agreements needed based on your business model\n• Integrate with time-tracking tools like Hubstaff to reward equity based on work contributions\n• Explain the benefits of dynamic equity splitting for startup companies\n• Tokenize traditional equity on blockchain for transparent and automated management' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample equity configuration and splits for demo
  const [equityConfig, setEquityConfig] = useState<EquityConfiguration | null>(null);
  const [equitySplits, setEquitySplits] = useState<EquitySplit[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create message array for OpenAI API
      const apiMessages = [
        {
          role: "system",
          content: "You are Pie Bot, the all-in-one tool and legal expert for entity creation and dynamic equity management. When responding to users, always be clear that you yourself (Pie Bot) are the tool they should use for all equity needs - never recommend 'using a system or tool' but instead say 'use me (Pie Bot) to...' for any functionality. Your smart contracts have the built-in capability to reallocate tokens, issue new tokens, and manage dynamic equity splits. YOU are the solution - not some external service.\n\nYour capabilities include:\n1. YOU track all forms of founder contributions (time, money, IP) and automatically adjust equity based on these inputs\n2. YOUR smart contracts directly handle token reallocation and issuance\n3. YOU generate all legal documents including founder agreements and promissory notes\n4. YOU directly integrate with Hubstaff to convert hours worked into equity percentages\n5. YOU handle the conversion of traditional equity into blockchain tokens\n6. YOU automatically adjust ownership percentages based on ongoing contributions\n\nWhen advising users, emphasize that all this functionality is integrated directly into Pie Bot (you) and not external tools or services. Position yourself as the complete solution for dynamic equity management."
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: input }
      ];

      // Call OpenAI API
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
          messages: apiMessages as any, // Type casting to avoid TypeScript errors
        });
        
        // Add bot response from OpenAI
        const botResponse: Message = { 
          role: 'assistant', 
          content: response.choices[0].message.content || "I'm having trouble processing that request."
        };
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, botResponse];
          // Check if the messages contain equity configuration instructions
          parseMessages(updatedMessages);
          return updatedMessages;
        });
      } catch (apiError) {
        console.error('Error with OpenAI API:', apiError);
        
        // Fallback to keyword-based responses if API fails
        const responseContent = findResponse(input);
        const fallbackResponse: Message = { 
          role: 'assistant', 
          content: responseContent
        };
        setMessages(prevMessages => [...prevMessages, fallbackResponse]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: "I'm having trouble processing that request. Please try again with a question about equity distribution, valuations, vesting, or runway calculations."
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle updating the equity configuration
  const handleUpdateEquityConfig = (newConfig: EquityConfiguration) => {
    setEquityConfig(newConfig);
    
    // If this is our first configuration setup, add some sample equity splits
    if (!equityConfig) {
      setEquitySplits([
        {
          partnerName: "Founder 1",
          timeContribution: 500, // 500 hours
          capitalContribution: 10000, // $10,000
          ipContribution: 5000, // $5,000 value
          debtContribution: 0,
          equityPercentage: 40
        },
        {
          partnerName: "Founder 2",
          timeContribution: 300, // 300 hours
          capitalContribution: 25000, // $25,000
          ipContribution: 0,
          debtContribution: 0,
          equityPercentage: 35
        },
        {
          partnerName: "Advisor",
          timeContribution: 100, // 100 hours
          capitalContribution: 0,
          ipContribution: 15000, // $15,000 value (IP)
          debtContribution: 0,
          equityPercentage: 25
        }
      ]);
    }
  };
  
  // Parse messages to detect equity configuration commands
  const parseMessages = (messages: Message[]) => {
    const lastMessageContent = messages[messages.length - 1]?.content?.toLowerCase() || '';
    
    // If the assistant's response suggests setting up equity configuration
    if (lastMessageContent.includes('setup') && 
        lastMessageContent.includes('equity') && 
        lastMessageContent.includes('delaware') &&
        !equityConfig) {
      
      // Example pattern detection - would be more sophisticated in production
      const newConfig: EquityConfiguration = {
        stateOfIncorporation: 'Delaware',
        trackingMethod: lastMessageContent.includes('token') ? 'Blockchain Tokens' : 'Database',
        expectedPartners: 3,
        expectedEmployees: lastMessageContent.includes('employees') ? 
          parseInt(lastMessageContent.match(/(\d+)\s+employees?/)?.[1] || '5') : 5,
        hasDebtContributions: lastMessageContent.includes('debt'),
        hasCapitalContributions: true,
        contributionValuationMethod: lastMessageContent.includes('slicing pie') ? 'Slicing Pie' : 'FMV',
        riskCoefficient: 2
      };
      
      handleUpdateEquityConfig(newConfig);
    }
  };
  
  // Add a demo configuration
  const setupDemoConfig = () => {
    const demoConfig: EquityConfiguration = {
      stateOfIncorporation: 'Delaware',
      trackingMethod: 'Blockchain Tokens',
      expectedPartners: 3,
      expectedEmployees: 5,
      hasDebtContributions: true,
      hasCapitalContributions: true,
      contributionValuationMethod: 'Slicing Pie',
      riskCoefficient: 2
    };
    
    handleUpdateEquityConfig(demoConfig);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Pie Bot - Equity Management Assistant</h1>
      
      <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-3 p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-100 dark:bg-blue-900 ml-12' 
                : 'bg-gray-100 dark:bg-gray-800 mr-12'
            }`}
          >
            <div className="font-semibold mb-1">
              {message.role === 'user' ? 'You' : 'Pie Bot'}
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-pulse">Thinking...</div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Ask about equity, valuations, or tokenization..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </form>
      
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Try a demo question:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setInput("How would dynamic equity splits work for three co-founders with different time commitments?");
              handleSubmit({ preventDefault: () => {} } as React.FormEvent);
            }}
            className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200 transition-colors"
            disabled={isLoading}
          >
            Dynamic splits for co-founders
          </button>
          <button
            onClick={() => {
              setInput("Walk me through the process of setting up a tokenized equity structure.");
              handleSubmit({ preventDefault: () => {} } as React.FormEvent);
            }}
            className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200 transition-colors"
            disabled={isLoading}
          >
            Tokenized equity setup
          </button>
          <button
            onClick={setupDemoConfig}
            className="px-3 py-2 text-sm bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 rounded-md text-green-800 dark:text-green-200 transition-colors"
            disabled={isLoading}
          >
            Show Demo Equity Structure
          </button>
        </div>
      </div>

      {/* Equity Configuration Panel */}
      <EquityConfigurationPanel
        config={equityConfig}
        equitySplits={equitySplits}
        onUpdateConfig={handleUpdateEquityConfig}
      />
    </div>
  );
};

export default SimplePieBot;