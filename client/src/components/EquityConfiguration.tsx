import { useState } from 'react';

export type ContributionFormula = 'FMV' | 'Slicing Pie' | 'Custom';

export interface EquityConfiguration {
  stateOfIncorporation: string;
  trackingMethod: 'Database' | 'Blockchain Tokens';
  expectedPartners: number;
  expectedEmployees: number;
  hasDebtContributions: boolean;
  hasCapitalContributions: boolean;
  contributionValuationMethod: ContributionFormula;
  riskCoefficient: number; // For Slicing Pie formula
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
  'Slicing Pie': 'Dynamic allocation based on relative value of contributions with risk adjustment. Uses a "Grunt Fund" model where contributions are valued at 2x for cash and market rates for time, adjusted by a risk coefficient.',
  'Custom': 'Fully customizable formula with user-defined weights for different contribution types and custom risk adjustments.'
};

const EquityConfigurationPanel: React.FC<EquityConfigurationProps> = ({ 
  config, 
  equitySplits, 
  onUpdateConfig 
}) => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  
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
      case 'Slicing Pie':
        // Apply risk coefficient to non-cash contributions
        return (
          (split.timeContribution * 100 * config.riskCoefficient) + // Time with risk multiplier
          (split.capitalContribution * 2) + // Cash valued at 2x in Slicing Pie
          (split.ipContribution * config.riskCoefficient) +
          (split.debtContribution * 1.5) // Debt at 1.5x (typical Slicing Pie)
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
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setIsConfiguring(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Edit Configuration
        </button>
      </div>
    </div>
  );
};

export default EquityConfigurationPanel;