import OpenAI from "openai";

// Initialize OpenAI with API key
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const DEFAULT_MODEL = "gpt-4o";

/**
 * Generate equity agreement text for a stakeholder
 */
export async function generateEquityAgreement(
  companyName: string, 
  entityType: string, 
  recipientName: string, 
  shares: number, 
  equityType: string, 
  ownershipPercentage: number, 
  vestingSchedule?: string
): Promise<string> {
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
          content: `Generate an equity agreement for ${recipientName} joining ${companyName} (a ${entityType}).
            
            Company Details:
            - Name: ${companyName}
            - Entity Type: ${entityType}
            
            Stakeholder Details:
            - Name: ${recipientName}
            - Equity Type: ${equityType}
            - Shares Allocated: ${shares} (${ownershipPercentage}%)
            - Vesting Schedule: ${vestingSchedule || "Standard 4 years with 1 year cliff"}
            
            Please format the document with appropriate sections including vesting terms, rights, and obligations.`
        }
      ],
    });

    return response.choices[0].message.content || "Unable to generate agreement";
  } catch (error: any) {
    console.error("Error generating equity agreement:", error);
    return `Error generating equity agreement: ${error.message}`;
  }
}

export default openai;