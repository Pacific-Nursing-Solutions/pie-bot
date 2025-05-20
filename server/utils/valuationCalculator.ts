import { Company, FinancialData } from "@shared/schema";

/**
 * Calculates company valuation based on different methods
 * 
 * @param company Company information
 * @param financialData Financial data
 * @param method Valuation method to use
 * @param params Additional parameters for valuation
 * @returns Calculated valuation
 */
export function calculateValuation(
  company: Company,
  financialData: FinancialData | undefined,
  method: 'comparable' | 'dcf' | 'multiple',
  params?: Record<string, any>
): number {
  switch (method) {
    case 'comparable':
      return calculateComparableValuation(company, financialData, params);
    case 'dcf':
      return calculateDCFValuation(company, financialData, params);
    case 'multiple':
      return calculateMultipleValuation(company, financialData, params);
    default:
      throw new Error(`Unsupported valuation method: ${method}`);
  }
}

/**
 * Calculates valuation based on comparable companies
 */
function calculateComparableValuation(
  company: Company,
  financialData: FinancialData | undefined,
  params?: Record<string, any>
): number {
  // In a real implementation, this would use actual comparable company data
  // For this demo, we'll use a simplified calculation
  
  const revenue = financialData?.revenue ? Number(financialData.revenue) : 0;
  const multiplier = params?.multiplier || 10; // Default revenue multiplier
  
  if (revenue === 0) {
    // If no revenue, use a base valuation plus authorized shares
    return 1000000 + (company.authorizedShares * 0.1);
  }
  
  // Calculate valuation based on revenue multiplier
  return revenue * multiplier;
}

/**
 * Calculates valuation using Discounted Cash Flow method
 */
function calculateDCFValuation(
  company: Company,
  financialData: FinancialData | undefined,
  params?: Record<string, any>
): number {
  // In a real implementation, this would perform a proper DCF calculation
  // For this demo, we'll use a simplified calculation
  
  const revenue = financialData?.revenue ? Number(financialData.revenue) : 0;
  const expenses = financialData?.expenses ? Number(financialData.expenses) : 0;
  const cashFlow = revenue - expenses;
  
  const growthRate = params?.growthRate || 0.2; // 20% annual growth
  const discountRate = params?.discountRate || 0.25; // 25% discount rate
  const years = params?.years || 5; // 5-year projection
  
  let totalPresentValue = 0;
  let currentCashFlow = cashFlow;
  
  // Calculate present value of future cash flows
  for (let year = 1; year <= years; year++) {
    currentCashFlow *= (1 + growthRate);
    const presentValue = currentCashFlow / Math.pow(1 + discountRate, year);
    totalPresentValue += presentValue;
  }
  
  // Add terminal value
  const terminalValue = (currentCashFlow * (1 + growthRate)) / (discountRate - growthRate);
  const presentTerminalValue = terminalValue / Math.pow(1 + discountRate, years);
  
  return totalPresentValue + presentTerminalValue;
}

/**
 * Calculates valuation using a multiple of a financial metric
 */
function calculateMultipleValuation(
  company: Company,
  financialData: FinancialData | undefined,
  params?: Record<string, any>
): number {
  // In a real implementation, this would use industry-standard multiples
  // For this demo, we'll use simplified calculations
  
  const metric = params?.metric || 'revenue';
  const multiple = params?.multiple || 5;
  
  if (!financialData) {
    // If no financial data, use a simple calculation based on authorized shares
    return company.authorizedShares * 0.5;
  }
  
  switch (metric) {
    case 'revenue':
      return Number(financialData.revenue || 0) * multiple;
    case 'profit':
      const profit = Number(financialData.revenue || 0) - Number(financialData.expenses || 0);
      return profit > 0 ? profit * multiple : company.authorizedShares * 0.2;
    case 'users':
      // If 'users' is provided in params
      const users = params?.users || 0;
      return users * (params?.valuePerUser || 100);
    default:
      // Default to a multiple of monthly burn rate
      return Number(financialData.burnRate || 0) * 12 * multiple;
  }
}
