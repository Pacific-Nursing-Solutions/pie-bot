/**
 * PDF generation utility
 * 
 * This is a simplified implementation. In a production environment,
 * you would use a library like PDFKit to generate proper PDFs.
 */

export async function generatePDF(content: string): Promise<Buffer> {
  // In a real implementation, this would use PDFKit to generate a proper PDF
  // For this demo, we'll create a minimal PDF structure
  
  const pdfHeader = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 6 0 R >> >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 44 >>
stream
BT /F1 12 Tf 72 720 Td (`;
  
  const pdfFooter = `) Tj ET
endstream
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000216 00000 n 
0000000330 00000 n 
0000000261 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
424
%%EOF`;
  
  // Format content for PDF
  // In a real implementation, this would properly format the text, including line breaks
  const formattedContent = content.replace(/\n/g, '\\n').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  
  // Create PDF buffer
  const pdfContent = pdfHeader + formattedContent + pdfFooter;
  
  return Buffer.from(pdfContent, 'utf-8');
}

export async function generateEquityAgreement(companyName: string, entityType: string, recipientName: string, shares: number, equityType: string, ownershipPercentage: number, vestingSchedule?: string): Promise<string> {
  // Generate equity agreement content
  const agreement = `EQUITY AGREEMENT

THIS EQUITY AGREEMENT (the "Agreement") is made and entered into as of ${new Date().toLocaleDateString()}, by and between ${companyName} (the "Company"), a ${entityType}, and ${recipientName} (the "Recipient").

WHEREAS, the Company desires to grant to the Recipient ${shares.toLocaleString()} shares of the Company's ${equityType}, representing ${ownershipPercentage}% ownership in the Company.

NOW, THEREFORE, in consideration of the mutual covenants and agreements set forth herein, the parties agree as follows:

1. GRANT OF EQUITY
Subject to the terms and conditions of this Agreement, the Company hereby grants to the Recipient ${shares.toLocaleString()} shares of the Company's ${equityType}.

2. VESTING SCHEDULE
The shares granted hereunder shall vest according to the following schedule: ${vestingSchedule || "Standard 4 years with 1 year cliff"}

3. REPRESENTATIONS AND WARRANTIES
The Recipient represents and warrants that they have the full right and authority to enter into this Agreement and to perform their obligations hereunder.

4. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the state of Delaware.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

COMPANY:
${companyName}

By: _________________________
Name: 
Title: 

RECIPIENT:
${recipientName}

_________________________
Signature`;

  return agreement;
}
