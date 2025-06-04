import React, { useState, useEffect } from 'react';

export interface EquityConfiguration {
  stateOfIncorporation: string;
  legalStructure: 'LLC' | 'C-Corporation' | 'S-Corporation' | 'Partnership' | 'Other';
  trackingMethod: 'Database' | 'Blockchain Tokens';
  expectedPartners: number;
  expectedEmployees: number;
  hasDebtContributions: boolean;
  hasCapitalContributions: boolean;
  capitalMultiplier: number; // Multiplier for capital contributions (relative to FMV)
  debtMultiplier: number; // Multiplier for debt contributions
  timeMultiplier: number; // Multiplier for time contributions
  ipMultiplier: number; // Multiplier for intellectual property
  propertyMultiplier: number; // Multiplier for used property/equipment
}

export interface EquitySplit {
  partnerName: string;
  timeContribution: number; // Hours
  capitalContribution: number; // USD
  ipContribution: number; // Estimated value in USD
  debtContribution: number; // USD
  equityPercentage: number; // Calculated based on formula
}

interface EquityConfigurationProps {
  config: EquityConfiguration | null;
  equitySplits: EquitySplit[];
  onUpdateConfig: (config: EquityConfiguration) => void;
}

const contributionDescriptions = {
  capital: 'Cash investments and direct monetary contributions to the company.',
  time: 'Hours worked on the company, valued relative to market rate for the type of work.',
  ip: 'Patents, copyrights, trademarks, trade secrets, and other intellectual property.',
  property: 'Equipment, hardware, software licenses, or other physical assets contributed.'
};

const EquityConfigurationPanel: React.FC<EquityConfigurationProps> = ({ 
  config, 
  equitySplits, 
  onUpdateConfig 
}) => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [formState, setFormState] = useState<EquityConfiguration>({
    stateOfIncorporation: 'Delaware',
    legalStructure: 'LLC',
    trackingMethod: 'Database',
    expectedPartners: 3,
    expectedEmployees: 5,
    hasDebtContributions: false,
    hasCapitalContributions: true,
    capitalMultiplier: 4.0,
    debtMultiplier: 3.0,
    timeMultiplier: 2.0,
    ipMultiplier: 3.0,
    propertyMultiplier: 1.5
  });
  
  // When config changes, update the form state
  useEffect(() => {
    if (config) {
      setFormState(config);
    }
  }, [config]);
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formState);
    setIsConfiguring(false);
  };
  
  // Configuration Form Component
  const ConfigurationForm = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Configure Equity Structure
          </h2>
          
          <form onSubmit={handleFormSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State of Incorporation
                  </label>
                  <select 
                    value={formState.stateOfIncorporation}
                    onChange={(e) => setFormState({...formState, stateOfIncorporation: e.target.value})}
                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="Delaware">Delaware</option>
                    <option value="California">California</option>
                    <option value="New York">New York</option>
                    <option value="Wyoming">Wyoming</option>
                    <option value="Nevada">Nevada</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Legal Structure
                  </label>
                  <select 
                    value={formState.legalStructure}
                    onChange={(e) => setFormState({
                      ...formState, 
                      legalStructure: e.target.value as EquityConfiguration['legalStructure']
                    })}
                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="LLC">LLC</option>
                    <option value="C-Corporation">C-Corporation</option>
                    <option value="S-Corporation">S-Corporation</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Equity Tracking Method
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      checked={formState.trackingMethod === 'Database'} 
                      onChange={() => setFormState({...formState, trackingMethod: 'Database'})}
                      className="mr-2"
                    />
                    <span>Traditional Database</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      checked={formState.trackingMethod === 'Blockchain Tokens'} 
                      onChange={() => setFormState({...formState, trackingMethod: 'Blockchain Tokens'})}
                      className="mr-2"
                    />
                    <span>Blockchain Tokens</span>
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expected Partners
                  </label>
                  <input 
                    type="number" 
                    min="1" 
                    value={formState.expectedPartners}
                    onChange={(e) => setFormState({...formState, expectedPartners: parseInt(e.target.value) || 1})}
                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expected Employees
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    value={formState.expectedEmployees}
                    onChange={(e) => setFormState({...formState, expectedEmployees: parseInt(e.target.value) || 0})}
                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contribution Types
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={formState.hasCapitalContributions} 
                      onChange={(e) => setFormState({...formState, hasCapitalContributions: e.target.checked})}
                      className="mr-2"
                    />
                    <span>Capital Contributions</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={formState.hasDebtContributions} 
                      onChange={(e) => setFormState({...formState, hasDebtContributions: e.target.checked})}
                      className="mr-2"
                    />
                    <span>Debt Contributions</span>
                  </label>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-3 border-b pb-2">
                  <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
                    Contribution Valuation Multipliers
                  </h3>
                  <div className="relative ml-2 group">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 cursor-help font-medium text-xs">
                      i
                    </div>
                    <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      Risk multipliers in dynamic equity differ from standard accounting practices by rewarding early contributions with higher equity value. This approach recognizes the increased risk taken by early contributors.
                    </div>
                  </div>
                </div>
                <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">
                  Set how much to value each type of contribution relative to its Fair Market Value (FMV).
                  Higher multipliers give more equity weight to that contribution type.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Capital Multiplier (1-8x)
                      </label>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{formState.capitalMultiplier}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="8" 
                      step="0.5"
                      value={formState.capitalMultiplier}
                      onChange={(e) => setFormState({...formState, capitalMultiplier: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>1x (FMV)</span>
                      <span>8x (Highly Valued)</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {contributionDescriptions.capital}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Debt Multiplier (1-6x)
                      </label>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{formState.debtMultiplier}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="6" 
                      step="0.5"
                      value={formState.debtMultiplier}
                      onChange={(e) => setFormState({...formState, debtMultiplier: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>1x (FMV)</span>
                      <span>6x (Highly Valued)</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Loans, promissory notes, and other debt contributions to the company.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Time Multiplier (1-6x)
                      </label>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{formState.timeMultiplier}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="6" 
                      step="0.5"
                      value={formState.timeMultiplier}
                      onChange={(e) => setFormState({...formState, timeMultiplier: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>1x (FMV)</span>
                      <span>6x (Highly Valued)</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {contributionDescriptions.time}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        IP Multiplier (1-7x)
                      </label>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{formState.ipMultiplier}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="7" 
                      step="0.5"
                      value={formState.ipMultiplier}
                      onChange={(e) => setFormState({...formState, ipMultiplier: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>1x (FMV)</span>
                      <span>7x (Highly Valued)</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {contributionDescriptions.ip}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Property Multiplier (1-4x)
                      </label>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{formState.propertyMultiplier}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="4" 
                      step="0.5"
                      value={formState.propertyMultiplier}
                      onChange={(e) => setFormState({...formState, propertyMultiplier: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>1x (FMV)</span>
                      <span>4x (Highly Valued)</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {contributionDescriptions.property}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsConfiguring(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-secondary"
              >
                Save Configuration
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  if (!config) {
    return (
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Equity Configuration Set
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ask Pie Bot to help you set up your equity structure or create one manually.
          </p>
          <button
            onClick={() => setIsConfiguring(true)}
            className="btn-secondary"
          >
            Configure Manually
          </button>
        </div>
        
        {isConfiguring && <ConfigurationForm />}
      </div>
    );
  }
  
  // Function to calculate equity with multipliers for each contribution type
  const calculateEquity = (split: EquitySplit, config: EquityConfiguration): number => {
    // Apply multipliers to each contribution type
    return (
      // Time contributions (valued at $100/hr base rate) multiplied by time multiplier
      (split.timeContribution * 100 * config.timeMultiplier) + 
      
      // Cash/capital contributions multiplied by capital multiplier
      (split.capitalContribution * config.capitalMultiplier) + 
      
      // IP contributions multiplied by IP multiplier
      (split.ipContribution * config.ipMultiplier) +
      
      // Debt contributions using their own specific multiplier
      (split.debtContribution * config.debtMultiplier)
    );
  };
  
  // Calculate total value of all contributions
  const calculateTotalValue = () => {
    if (equitySplits.length === 0) return 0;
    
    return equitySplits.reduce((total, split) => {
      return total + calculateEquity(split, config);
    }, 0);
  };
  
  const totalValue = calculateTotalValue();
  
  return (
    <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Equity Configuration
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Company Setup
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">State of Incorporation:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{config.stateOfIncorporation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tracking Method:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{config.trackingMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Expected Partners:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{config.expectedPartners}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Expected Employees:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{config.expectedEmployees}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Contribution Settings
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Capital Contributions:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {config.hasCapitalContributions ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Debt Contributions:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {config.hasDebtContributions ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-gray-600 dark:text-gray-400">Valuation Method:</span>
                <div className="relative ml-1 group">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 cursor-help font-medium text-xs">
                    i
                  </div>
                  <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    Risk multipliers differ from standard accounting by valuing early-stage contributions more highly to account for the increased risk.
                  </div>
                </div>
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Dynamic Multipliers
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Capital Multiplier:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {config.capitalMultiplier}x
              </span>
            </div>
            {config.hasDebtContributions && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Debt Multiplier:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {config.debtMultiplier}x
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Time Multiplier:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {config.timeMultiplier}x
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">IP Multiplier:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {config.ipMultiplier}x
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Property Multiplier:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {config.propertyMultiplier}x
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-800 dark:text-blue-200">
        <p className="font-medium">Dynamic Contribution Valuation</p>
        <p>Multipliers adjust contribution value based on risk and timing, rewarding early-stage contributions.</p>
      </div>
      
      {equitySplits.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Current Equity Distribution
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2">Partner</th>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Capital</th>
                  <th className="px-4 py-2">IP</th>
                  <th className="px-4 py-2">Debt</th>
                  <th className="px-4 py-2">Equity %</th>
                </tr>
              </thead>
              <tbody>
                {equitySplits.map((split, index) => {
                  const equityValue = calculateEquity(split, config);
                  const percentage = totalValue > 0 ? (equityValue / totalValue) * 100 : 0;
                  
                  return (
                    <tr key={index} className="border-b dark:border-gray-700">
                      <td className="px-4 py-3 font-medium">{split.partnerName}</td>
                      <td className="px-4 py-3">{split.timeContribution} hrs</td>
                      <td className="px-4 py-3">${split.capitalContribution.toLocaleString()}</td>
                      <td className="px-4 py-3">${split.ipContribution.toLocaleString()}</td>
                      <td className="px-4 py-3">${split.debtContribution.toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium">{percentage.toFixed(2)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-6 text-center py-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            No equity partners defined yet. Ask Pie Bot to help you add partners or define them manually.
          </p>
        </div>
      )}
      
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => setIsConfiguring(true)}
          className="btn-secondary"
        >
          Edit Configuration
        </button>
      </div>
      
      {isConfiguring && <ConfigurationForm />}
    </div>
  );
};

export default EquityConfigurationPanel;