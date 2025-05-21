import React, { useState, useEffect } from 'react';

export type ContributionFormula = 'FMV' | 'Dynamic Risk Adjusted' | 'Custom';

export interface EquityConfiguration {
  stateOfIncorporation: string;
  legalStructure: 'LLC' | 'C-Corporation' | 'S-Corporation' | 'Partnership' | 'Other';
  trackingMethod: 'Database' | 'Blockchain Tokens';
  expectedPartners: number;
  expectedEmployees: number;
  hasDebtContributions: boolean;
  hasCapitalContributions: boolean;
  contributionValuationMethod: ContributionFormula;
  riskCoefficient: number; // Risk adjustment multiplier
  capitalMultiplier: number; // Specific multiplier for capital contributions
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

const formulaDescriptions = {
  'FMV': 'Fair Market Value: Values contributions at their current market value, as defined by IRS regulations. This approach uses objective external benchmarks to determine contribution worth.',
  'Dynamic Risk Adjusted': 'Dynamic allocation based on relative value of contributions with advanced risk adjustments. Time contributions are valued with a risk coefficient multiplier, while capital can be valued up to 4x or higher based on your custom settings.',
  'Custom': 'Fully customizable formula with user-defined weights for different contribution types and custom risk adjustments.'
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
    contributionValuationMethod: 'FMV',
    riskCoefficient: 2,
    capitalMultiplier: 1
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contribution Valuation Method
                </label>
                <select 
                  value={formState.contributionValuationMethod}
                  onChange={(e) => setFormState({
                    ...formState, 
                    contributionValuationMethod: e.target.value as ContributionFormula
                  })}
                  className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="FMV">Fair Market Value (FMV)</option>
                  <option value="Dynamic Risk Adjusted">Dynamic Risk Adjusted</option>
                  <option value="Custom">Custom Formula</option>
                </select>
                
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                  <p className="font-medium mb-1">{formState.contributionValuationMethod}</p>
                  <p>{formulaDescriptions[formState.contributionValuationMethod]}</p>
                </div>
              </div>
              
              {formState.contributionValuationMethod === 'Dynamic Risk Adjusted' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Risk Coefficient for Time & IP (1-6x)
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="6" 
                      step="0.5"
                      value={formState.riskCoefficient}
                      onChange={(e) => setFormState({...formState, riskCoefficient: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs">
                      <span>1x (Low Risk)</span>
                      <span>{formState.riskCoefficient}x</span>
                      <span>6x (High Risk)</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Higher values give more equity to time and intellectual property contributions
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Capital Multiplier (1-8x)
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="8" 
                      step="0.5"
                      value={formState.capitalMultiplier}
                      onChange={(e) => setFormState({...formState, capitalMultiplier: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs">
                      <span>1x (FMV)</span>
                      <span>{formState.capitalMultiplier}x</span>
                      <span>8x (Highly Valued)</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Higher values give more equity to cash and capital contributions
                    </p>
                  </div>
                </div>
              )}
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Configure Manually
          </button>
        </div>
        
        {isConfiguring && <ConfigurationForm />}
      </div>
    );
  }
  
  // Function to calculate equity based on the selected formula
  const calculateEquity = (split: EquitySplit, config: EquityConfiguration): number => {
    // This is a simplified calculation - would be more complex in production
    switch (config.contributionValuationMethod) {
      case 'FMV':
        // Simple Fair Market Value - sum of all contributions
        return (
          split.timeContribution * 100 + // Simplified: value time at $100/hr
          split.capitalContribution +
          split.ipContribution +
          split.debtContribution
        );
      case 'Dynamic Risk Adjusted':
        // Apply risk coefficient to non-cash contributions and capital multiplier to cash
        return (
          (split.timeContribution * 100 * config.riskCoefficient) + // Time with risk multiplier
          (split.capitalContribution * config.capitalMultiplier) + // Cash with capital multiplier
          (split.ipContribution * config.riskCoefficient) +
          (split.debtContribution * (config.capitalMultiplier * 0.75)) // Debt at 75% of capital multiplier
        );
      case 'Custom':
        // Placeholder for custom formula
        return split.equityPercentage;
      default:
        return 0;
    }
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
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Valuation Formula:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {config.contributionValuationMethod}
              </span>
            </div>
            {config.contributionValuationMethod === 'Slicing Pie' && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Risk Coefficient:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {config.riskCoefficient}x
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-800 dark:text-blue-200">
        <p className="font-medium">Formula: {config.contributionValuationMethod}</p>
        <p>{formulaDescriptions[config.contributionValuationMethod]}</p>
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
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Edit Configuration
        </button>
      </div>
      
      {isConfiguring && <ConfigurationForm />}
    </div>
  );
};

export default EquityConfigurationPanel;