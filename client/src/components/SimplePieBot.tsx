import { useState } from 'react';
import openai from '@/lib/openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

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
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Process command with OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are Pie Bot, an expert financial assistant for startup equity management. Help users understand equity concepts, calculate valuations, and provide guidance on equity distribution and financial planning."
          } as any,
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          } as any)),
          { role: "user", content: input } as any
        ],
      });

      // Add bot response
      const botResponse = { 
        role: 'assistant', 
        content: response.choices[0].message.content || "I'm having trouble processing that request."
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting to my knowledge base. Please try again later."
      }]);
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