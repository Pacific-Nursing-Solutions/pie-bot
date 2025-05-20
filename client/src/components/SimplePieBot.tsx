import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Sample responses for common equity questions
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
      content: 'Welcome to Pie Bot! I can help you manage your company equity, generate documents, and calculate financial projections. What would you like to do?' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // In our simplified version, we're using predefined responses instead of OpenAI
      // This allows the demo to work without API connection issues
      
      // Small delay to simulate "thinking"
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate response based on input
      const responseContent = findResponse(input);
      
      // Add bot response
      const botResponse: Message = { 
        role: 'assistant', 
        content: responseContent
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
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

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
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
          placeholder="Ask about equity, valuations, or company formation..."
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
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Example commands:</p>
        <ul className="list-disc pl-5 mt-1">
          <li>"How should I distribute equity among founders?"</li>
          <li>"What's a fair valuation method for my pre-revenue startup?"</li>
          <li>"Explain vesting schedules for equity"</li>
          <li>"How do I calculate my startup's runway?"</li>
        </ul>
      </div>
    </div>
  );
};

export default SimplePieBot;