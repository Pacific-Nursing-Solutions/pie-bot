import OpenAI from "openai";

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({ 
  apiKey: import.meta.env.OPENAI_API_KEY
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const DEFAULT_MODEL = "gpt-4o";

/**
 * Generate equity agreement text based on company and stakeholder information
 */
export async function generateEquityAgreement(companyInfo: any, stakeholderInfo: any) {
  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a legal expert specializing in equity agreements. Generate a professional equity agreement based on the provided information. The agreement should be legally sound but presented in plain language."
        },
        {
          role: "user",
          content: `Generate an equity agreement for ${stakeholderInfo.name} joining ${companyInfo.name} (a ${companyInfo.entityType}).
            
            Company Details:
            - Name: ${companyInfo.name}
            - Entity Type: ${companyInfo.entityType}
            - Authorized Shares: ${companyInfo.authorizedShares}
            
            Stakeholder Details:
            - Name: ${stakeholderInfo.name}
            - Role: ${stakeholderInfo.role}
            - Equity Type: ${stakeholderInfo.equityType}
            - Shares Allocated: ${stakeholderInfo.shares} (${stakeholderInfo.ownershipPercentage}%)
            - Vesting Schedule: ${stakeholderInfo.vestingSchedule || "Standard 4 years with 1 year cliff"}
            
            Please format the document with appropriate sections including vesting terms, rights, and obligations.`
        }
      ],
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    console.error("Error generating equity agreement:", error);
    throw new Error(`Failed to generate equity agreement: ${error.message}`);
  }
}

/**
 * Analyze company valuation based on financial data and market comparables
 */
export async function analyzeCompanyValuation(companyInfo: any, financialData: any) {
  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a financial analyst specializing in startup valuations. Provide a detailed analysis of the company's potential valuation based on the provided information."
        },
        {
          role: "user",
          content: `Analyze the valuation for ${companyInfo.name} (a ${companyInfo.entityType}).
            
            Company Details:
            - Name: ${companyInfo.name}
            - Entity Type: ${companyInfo.entityType}
            - Industry: ${companyInfo.industry || "Technology"}
            - Founded: ${companyInfo.founded}
            
            Financial Data:
            - Cash Balance: $${financialData.cashBalance}
            - Monthly Burn Rate: $${financialData.burnRate}
            - Revenue (if any): $${financialData.revenue || 0}
            - Growth Rate (if any): ${financialData.growthRate || 0}%
            
            Please provide a valuation range with justification and methodology used.`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error: any) {
    console.error("Error analyzing company valuation:", error);
    throw new Error(`Failed to analyze company valuation: ${error.message}`);
  }
}

/**
 * Generate liquidation schedule based on company financial data
 */
export async function generateLiquidationSchedule(companyInfo: any, financialData: any, stakeholders: any[]) {
  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a financial expert specializing in company liquidation schedules. Generate a detailed liquidation schedule based on the provided information."
        },
        {
          role: "user",
          content: `Generate a liquidation schedule for ${companyInfo.name} (a ${companyInfo.entityType}).
            
            Company Details:
            - Name: ${companyInfo.name}
            - Entity Type: ${companyInfo.entityType}
            - Valuation: $${companyInfo.valuation}
            
            Financial Data:
            - Cash Balance: $${financialData.cashBalance}
            - Total Debt: $${financialData.totalDebt || 0}
            
            Stakeholders:
            ${stakeholders.map(s => `- ${s.name} (${s.role}): ${s.ownershipPercentage}%, ${s.equityType}`).join('\n')}
            
            Please provide a detailed distribution schedule in the event of liquidation, showing how funds would be distributed to different stakeholders.`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error: any) {
    console.error("Error generating liquidation schedule:", error);
    throw new Error(`Failed to generate liquidation schedule: ${error.message}`);
  }
}

export default openai;
