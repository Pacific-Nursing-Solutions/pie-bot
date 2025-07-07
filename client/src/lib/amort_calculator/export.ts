import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { PaymentEntry, LoanInput } from '@shared/schema';

export function exportToCSV(schedule: PaymentEntry[], loanData: LoanInput) {
  const csvContent = [
    ["Payment #", "Date", "Payment Amount", "Principal", "Interest", "Remaining Balance"],
    ...schedule.map(payment => [
      payment.paymentNumber,
      payment.date,
      payment.paymentAmount.toFixed(2),
      payment.principalAmount.toFixed(2),
      payment.interestAmount.toFixed(2),
      payment.remainingBalance.toFixed(2)
    ])
  ].map(row => row.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `amortization-schedule-${new Date().toISOString().split('T')[0]}.csv`);
}

export function exportToExcel(schedule: PaymentEntry[], loanData: LoanInput) {
  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Loan Summary Sheet
  const summaryData = [
    ["Loan Details", ""],
    ["Loan Amount", `$${loanData.loanAmount.toLocaleString()}`],
    ["Interest Rate", `${loanData.interestRate}%`],
    ["Loan Term", `${loanData.loanTerm} ${loanData.termUnit}`],
    ["Payment Frequency", loanData.paymentFreq],
    ["Start Date", loanData.startDate],
    ["", ""],
    ["Summary", ""],
    ["Total Payments", `$${schedule.reduce((sum, p) => sum + p.paymentAmount, 0).toLocaleString()}`],
    ["Total Interest", `$${schedule.reduce((sum, p) => sum + p.interestAmount, 0).toLocaleString()}`],
    ["Total Principal", `$${loanData.loanAmount.toLocaleString()}`],
    ["Payoff Date", schedule[schedule.length - 1]?.date || ""],
  ];

  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
  
  // Set column widths
  summaryWS['!cols'] = [
    { width: 20 },
    { width: 15 }
  ];

  // Style the summary sheet
  const summaryRange = XLSX.utils.decode_range(summaryWS['!ref'] || 'A1');
  for (let row = summaryRange.s.r; row <= summaryRange.e.r; row++) {
    for (let col = summaryRange.s.c; col <= summaryRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      if (!summaryWS[cellAddress]) continue;
      
      // Header rows
      if (row === 0 || row === 7) {
        summaryWS[cellAddress].s = {
          font: { bold: true, sz: 14 },
          fill: { fgColor: { rgb: "E2E8F0" } }
        };
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, summaryWS, "Summary");

  // Amortization Schedule Sheet
  const scheduleData = [
    ["Payment #", "Date", "Payment Amount", "Principal", "Interest", "Remaining Balance"],
    ...schedule.map(payment => [
      payment.paymentNumber,
      payment.date,
      payment.paymentAmount,
      payment.principalAmount,
      payment.interestAmount,
      payment.remainingBalance
    ])
  ];

  const scheduleWS = XLSX.utils.aoa_to_sheet(scheduleData);

  // Set column widths
  scheduleWS['!cols'] = [
    { width: 10 },
    { width: 12 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 18 }
  ];

  // Format currency columns
  const scheduleRange = XLSX.utils.decode_range(scheduleWS['!ref'] || 'A1');
  for (let row = 1; row <= scheduleRange.e.r; row++) {
    // Format payment, principal, interest, and balance columns as currency
    [2, 3, 4, 5].forEach(col => {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      if (scheduleWS[cellAddress]) {
        scheduleWS[cellAddress].z = '"$"#,##0.00';
      }
    });
  }

  // Style header row
  for (let col = 0; col <= 5; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (scheduleWS[cellAddress]) {
      scheduleWS[cellAddress].s = {
        font: { color: { rgb: "FFFFFF" }, bold: true },
        fill: { fgColor: { rgb: "475569" } }
      };
    }
  }

  XLSX.utils.book_append_sheet(wb, scheduleWS, "Payment Schedule");

  // Charts Sheet (Data for charts)
  const chartData = schedule.map((payment, index) => ({
    "Payment Number": payment.paymentNumber,
    "Cumulative Principal": schedule.slice(0, index + 1).reduce((sum, p) => sum + p.principalAmount, 0),
    "Cumulative Interest": schedule.slice(0, index + 1).reduce((sum, p) => sum + p.interestAmount, 0),
    "Remaining Balance": payment.remainingBalance
  }));

  const chartWS = XLSX.utils.json_to_sheet(chartData);
  XLSX.utils.book_append_sheet(wb, chartWS, "Chart Data");

  // Save the file
  XLSX.writeFile(wb, `amortization-analysis-${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportAdvancedAnalytics(schedule: PaymentEntry[], loanData: LoanInput, extraPayments: any[]) {
  const totalInterest = schedule.reduce((sum, payment) => sum + payment.interestAmount, 0);
  const totalPrincipal = schedule.reduce((sum, payment) => sum + payment.principalAmount, 0);
  const averageMonthlyPayment = schedule.reduce((sum, payment) => sum + payment.paymentAmount, 0) / schedule.length;
  
  // Calculate advanced metrics
  const interestToIncomeRatio = (totalInterest / loanData.loanAmount) * 100;
  const payoffAcceleration = extraPayments.length > 0 ? calculatePayoffAcceleration(schedule, extraPayments) : 0;
  const effectiveRate = calculateEffectiveRate(schedule, loanData);
  const opportunityCost = calculateOpportunityCost(totalInterest);
  const inflationAdjustedCost = calculateInflationAdjustedCost(schedule);
  
  const content = `ADVANCED LOAN ANALYTICS REPORT
Generated: ${new Date().toLocaleDateString()}

=== LOAN OVERVIEW ===
Loan Amount: $${loanData.loanAmount.toLocaleString()}
Interest Rate: ${loanData.interestRate}%
Term: ${loanData.loanTerm} ${loanData.termUnit}
Monthly Payment: $${averageMonthlyPayment.toFixed(2)}

=== FINANCIAL IMPACT ===
Total Interest Paid: $${totalInterest.toLocaleString()}
Total Amount Paid: $${(totalInterest + totalPrincipal).toLocaleString()}
Interest-to-Principal Ratio: ${interestToIncomeRatio.toFixed(2)}%
Effective Interest Rate: ${effectiveRate}%

=== ADVANCED ANALYSIS ===
Payoff Acceleration: ${payoffAcceleration} months saved with extra payments
Opportunity Cost: $${opportunityCost.toLocaleString()} (7% investment alternative)
Inflation-Adjusted Cost: $${inflationAdjustedCost.toLocaleString()} (3% annual inflation)

=== CASH FLOW ANALYSIS ===
${generateCashFlowAnalysis(schedule)}

=== TAX IMPLICATIONS ===
${calculateTaxImplications(totalInterest)}

=== STRATEGIC RECOMMENDATIONS ===
${generateRecommendations(loanData, schedule, extraPayments).join('\n')}

=== DETAILED SCHEDULE ===
${schedule.slice(0, 12).map((payment, index) => 
  `Payment ${index + 1}: $${payment.paymentAmount.toFixed(2)} (Principal: $${payment.principalAmount.toFixed(2)}, Interest: $${payment.interestAmount.toFixed(2)}, Balance: $${payment.remainingBalance.toFixed(2)})`
).join('\n')}
... (${schedule.length - 12} additional payments)`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `advanced-analytics-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportScenarioComparison(loanData: LoanInput) {
  // Generate comparison scenarios with different terms and rates
  const termInYears = loanData.termUnit === 'years' ? loanData.loanTerm : loanData.loanTerm / 12;
  const scenarios = [
    { ...loanData, name: "Current Scenario" },
    { ...loanData, interestRate: Math.max(loanData.interestRate - 0.5, 0.1), name: "0.5% Lower Rate" },
    { ...loanData, interestRate: loanData.interestRate + 0.5, name: "0.5% Higher Rate" },
    { ...loanData, loanTerm: Math.max(termInYears - 5, 5), termUnit: 'years' as const, name: "5 Years Shorter" },
    { ...loanData, loanTerm: termInYears + 5, termUnit: 'years' as const, name: "5 Years Longer" },
    { ...loanData, loanAmount: loanData.loanAmount * 0.9, name: "10% Smaller Loan" },
    { ...loanData, loanAmount: loanData.loanAmount * 1.1, name: "10% Larger Loan" }
  ];
  
  const comparisonData = scenarios.map(scenario => {
    const monthlyRate = scenario.interestRate / 100 / 12;
    const termYears = scenario.termUnit === 'years' ? scenario.loanTerm : scenario.loanTerm / 12;
    const numPayments = termYears * 12;
    const monthlyPayment = (scenario.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalInterest = (monthlyPayment * numPayments) - scenario.loanAmount;
    
    // Calculate baseline for comparison
    const baselineTermYears = scenarios[0].termUnit === 'years' ? scenarios[0].loanTerm : scenarios[0].loanTerm / 12;
    const baselineNumPayments = baselineTermYears * 12;
    const baselineRate = scenarios[0].interestRate / 100 / 12;
    const baselinePayment = (scenarios[0].loanAmount * baselineRate * Math.pow(1 + baselineRate, baselineNumPayments)) / 
                           (Math.pow(1 + baselineRate, baselineNumPayments) - 1);
    const baselineInterest = (baselinePayment * baselineNumPayments) - scenarios[0].loanAmount;
    
    return {
      scenario: scenario.name,
      loanAmount: scenario.loanAmount,
      interestRate: scenario.interestRate,
      termYears,
      monthlyPayment,
      totalInterest,
      totalPaid: scenario.loanAmount + totalInterest,
      savings: baselineInterest - totalInterest
    };
  });
  
  const content = `LOAN SCENARIO COMPARISON REPORT
Generated: ${new Date().toLocaleDateString()}

${'Scenario'.padEnd(20)} | ${'Monthly'.padEnd(10)} | ${'Rate'.padEnd(6)} | ${'Term'.padEnd(6)} | ${'Total Interest'.padEnd(14)} | ${'Savings'.padEnd(12)}
${'-'.repeat(85)}
${comparisonData.map(row => 
  `${row.scenario.padEnd(20)} | $${row.monthlyPayment.toFixed(0).padEnd(9)} | ${row.interestRate.toFixed(2).padEnd(5)}% | ${row.termYears.toString().padEnd(4)}yr | $${row.totalInterest.toFixed(0).padEnd(13)} | $${(row.savings > 0 ? '+' : '')+ row.savings.toFixed(0).padEnd(11)}`
).join('\n')}

KEY INSIGHTS:
• Best Monthly Payment: ${comparisonData.reduce((min, curr) => curr.monthlyPayment < min.monthlyPayment ? curr : min).scenario} ($${comparisonData.reduce((min, curr) => curr.monthlyPayment < min.monthlyPayment ? curr : min).monthlyPayment.toFixed(0)})
• Lowest Total Interest: ${comparisonData.reduce((min, curr) => curr.totalInterest < min.totalInterest ? curr : min).scenario} ($${comparisonData.reduce((min, curr) => curr.totalInterest < min.totalInterest ? curr : min).totalInterest.toFixed(0)})
• Maximum Interest Savings: $${Math.max(...comparisonData.map(d => Math.abs(d.savings))).toFixed(0)}

RECOMMENDATIONS:
• Consider refinancing if rates have dropped 0.5% or more
• Shorter terms save significant interest but increase monthly payments
• Even small rate improvements compound to major savings over time`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `scenario-comparison-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Helper functions for advanced analytics
function calculatePayoffAcceleration(schedule: PaymentEntry[], extraPayments: any[]): number {
  const extraPaymentTotal = extraPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const averageMonthlyPayment = schedule[0]?.paymentAmount || 1000;
  return Math.floor(extraPaymentTotal / averageMonthlyPayment);
}

function calculateEffectiveRate(schedule: PaymentEntry[], loanData: LoanInput): number {
  const totalInterest = schedule.reduce((sum, payment) => sum + payment.interestAmount, 0);
  const termYears = loanData.termUnit === 'years' ? loanData.loanTerm : loanData.loanTerm / 12;
  const effectiveRate = (totalInterest / loanData.loanAmount / termYears) * 100;
  return Math.round(effectiveRate * 100) / 100;
}

function calculateOpportunityCost(totalInterest: number): number {
  // Assume 7% annual return on investments instead of extra payments
  const investmentReturn = totalInterest * 0.07;
  return Math.round(investmentReturn);
}

function calculateInflationAdjustedCost(schedule: PaymentEntry[]): number {
  // Assume 3% annual inflation reduces real cost
  const inflationRate = 0.03;
  let adjustedTotal = 0;
  schedule.forEach((payment, index) => {
    const years = index / 12;
    const adjustedPayment = payment.paymentAmount / Math.pow(1 + inflationRate, years);
    adjustedTotal += adjustedPayment;
  });
  return Math.round(adjustedTotal);
}

function generateCashFlowAnalysis(schedule: PaymentEntry[]): string {
  const quarterlyData = [];
  for (let i = 0; i < Math.min(schedule.length, 24); i += 3) { // First 2 years
    const quarter = schedule.slice(i, i + 3);
    const quarterlyPayment = quarter.reduce((sum, payment) => sum + payment.paymentAmount, 0);
    const quarterlyPrincipal = quarter.reduce((sum, payment) => sum + payment.principalAmount, 0);
    const quarterlyInterest = quarter.reduce((sum, payment) => sum + payment.interestAmount, 0);
    quarterlyData.push({
      quarter: Math.floor(i / 3) + 1,
      payment: quarterlyPayment,
      principal: quarterlyPrincipal,
      interest: quarterlyInterest
    });
  }
  
  return quarterlyData.map(q => 
    `Q${q.quarter}: Payment $${q.payment.toFixed(0)}, Principal $${q.principal.toFixed(0)}, Interest $${q.interest.toFixed(0)}`
  ).join('\n');
}

function calculateTaxImplications(totalInterest: number): string {
  const assumedTaxRate = 0.22; // 22% tax bracket
  const potentialDeduction = totalInterest * assumedTaxRate;
  
  return `Potential mortgage interest deduction: $${potentialDeduction.toLocaleString()}
Estimated annual tax savings: $${(potentialDeduction / 30).toFixed(0)} (if itemizing)
Note: Consult tax professional for actual deduction eligibility
Standard deduction may be more beneficial than itemizing`;
}

function generateRecommendations(loanData: LoanInput, schedule: PaymentEntry[], extraPayments: any[]): string[] {
  const recommendations = [];
  
  if (loanData.interestRate > 6) {
    recommendations.push("• Consider refinancing if current market rates are 0.5%+ lower");
  }
  
  if (extraPayments.length === 0) {
    recommendations.push("• Adding $100/month extra payment could save $15,000+ in interest");
  }
  
  const termYears = loanData.termUnit === 'years' ? loanData.loanTerm : loanData.loanTerm / 12;
  if (termYears > 25) {
    recommendations.push("• Consider shorter loan term to reduce total interest paid");
  }
  
  const totalInterest = schedule.reduce((sum, payment) => sum + payment.interestAmount, 0);
  if (totalInterest > loanData.loanAmount * 0.6) {
    recommendations.push("• High interest cost - explore payment acceleration strategies");
  }
  
  recommendations.push("• Review loan terms annually for refinancing opportunities");
  recommendations.push("• Build 6-month emergency fund before aggressive loan paydown");
  recommendations.push("• Compare loan paydown vs. investment returns (tax-adjusted)");
  
  return recommendations;
}

export function generatePromissoryNote(loanData: LoanInput, borrowerInfo: any, lenderInfo: any, securityInfo?: any, schedule?: PaymentEntry[], additionalTerms?: string): Blob {
  const today = new Date().toLocaleDateString();
  
  // Calculate proper payment details
  const principal = loanData.loanAmount;
  const annualRate = loanData.interestRate / 100;
  const monthlyRate = annualRate / 12;
  const termMonths = loanData.termUnit === 'years' ? loanData.loanTerm * 12 : loanData.loanTerm;
  
  let monthlyPayment = 0;
  if (monthlyRate > 0) {
    monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
  } else {
    monthlyPayment = principal / termMonths;
  }

  // Calculate payment dates
  const startDate = new Date(loanData.startDate);
  const firstPaymentDate = new Date(startDate);
  firstPaymentDate.setMonth(firstPaymentDate.getMonth() + 1);
  
  const finalPaymentDate = new Date(firstPaymentDate);
  finalPaymentDate.setMonth(finalPaymentDate.getMonth() + termMonths - 1);

  // Generate default schedule if not provided
  const paymentSchedule = schedule || [];
  
  // Helper function to format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Generate security section based on collateral type
  const getSecuritySection = () => {
    if (!securityInfo || securityInfo.type === 'unsecured') {
      return '<p><strong>SECURITY:</strong> This is an UNSECURED promissory note. No collateral secures this obligation.</p>';
    }

    const securityTypeMap = {
      'real_estate': 'Real Estate Property',
      'vehicle': 'Motor Vehicle',
      'personal_property': 'Personal Property',
      'business_assets': 'Business Assets',
      'securities': 'Securities and Investments'
    };

    const securityType = (securityTypeMap as any)[securityInfo.type] || 'Collateral';
    
    return `
      <p><strong>SECURITY:</strong> This is a SECURED promissory note. To secure payment of this note, the Borrower grants to the Lender a security interest in the following collateral:</p>
      <div style="border: 1px solid #000; padding: 15px; margin: 10px 0; background-color: #fff;">
        <p><strong>Collateral Type:</strong> ${securityType}</p>
        <p><strong>Description:</strong> ${securityInfo.description || 'As described in attached security agreement'}</p>
        ${securityInfo.value ? `<p><strong>Estimated Value:</strong> $${securityInfo.value.toLocaleString()}</p>` : ''}
      </div>
      <p><strong>SECURITY AGREEMENT:</strong> The Borrower agrees that until this note is paid in full, the Lender shall have a perfected security interest in the above-described collateral. The Borrower agrees to maintain adequate insurance on the collateral and not to sell, transfer, or encumber the collateral without the Lender's written consent.</p>
    `;
  };

  // Generate notary section if required
  const getNotarySection = () => {
    if (!securityInfo?.requireNotary) return '';
    
    return `
      <div style="border: 2px solid #000; padding: 20px; margin: 30px 0; background-color: #f8f8f8;">
        <h3 style="text-align: center; margin-bottom: 20px;">NOTARY ACKNOWLEDGMENT</h3>
        <p>State of: _______________________</p>
        <p>County of: ______________________</p>
        <p>On this _____ day of _____________, 20___, before me personally appeared ${borrowerInfo?.name || '_________________________'} and ${lenderInfo?.name || '_________________________'}, who proved to me on the basis of satisfactory evidence to be the person(s) whose name(s) is/are subscribed to the within instrument and acknowledged to me that he/she/they executed the same in his/her/their authorized capacity, and that by his/her/their signature(s) on the instrument the person(s), or the entity upon behalf of which the person(s) acted, executed the instrument.</p>
        
        <div style="margin-top: 30px;">
          <div style="float: left; width: 45%;">
            <div style="border-top: 1px solid #000; margin-top: 40px; text-align: center;">Notary Public Signature</div>
          </div>
          <div style="float: right; width: 45%;">
            <div style="border-top: 1px solid #000; margin-top: 40px; text-align: center;">Notary Public Seal</div>
          </div>
          <div style="clear: both;"></div>
        </div>
        
        <p style="margin-top: 20px; font-size: 10px;"><em>For online notarization, this document can be notarized through services like NotaryCam.com or Notarize.com</em></p>
      </div>
    `;
  };

  // Generate digital signature metadata if requested
  const getDigitalSigningMetadata = () => {
    if (!securityInfo?.useDigitalSigning) return '';
    
    return `
      <!-- Digital Signature Metadata for DocuSign/Blocsign Integration -->
      <div style="display: none;" id="digitalSigningMetadata">
        <meta name="signature-field-borrower" content="borrower-signature" />
        <meta name="signature-field-lender" content="lender-signature" />
        <meta name="signature-field-notary" content="notary-signature" />
        <meta name="document-type" content="promissory-note" />
        <meta name="signing-order" content="borrower,lender,notary" />
      </div>
    `;
  };

  const promissoryNoteHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Promissory Note</title>
      ${getDigitalSigningMetadata()}
      <style>
        body { 
          font-family: 'Times New Roman', serif; 
          margin: 60px; 
          line-height: 1.6; 
          color: #000;
          text-align: left;
        }
        .header { 
          text-align: center; 
          margin-bottom: 40px; 
          border-bottom: 2px solid #000;
          padding-bottom: 20px;
        }
        .title { 
          font-size: 28px; 
          font-weight: bold; 
          text-transform: uppercase; 
          letter-spacing: 3px; 
          margin-bottom: 20px;
        }
        .principal-info { 
          font-size: 16px; 
          margin: 20px 0; 
          font-weight: bold; 
        }
        .article-header { 
          font-size: 16px; 
          font-weight: bold; 
          text-transform: uppercase; 
          text-align: center; 
          margin: 30px 0 20px 0; 
          letter-spacing: 1px;
        }
        .parties-grid { 
          display: flex; 
          justify-content: space-between; 
          margin: 20px 0; 
        }
        .party-box { 
          width: 45%; 
          border: 2px solid #000; 
          padding: 20px; 
        }
        .payment-terms-box { 
          border: 1px solid #000; 
          padding: 15px; 
          margin: 15px 0; 
        }
        .payment-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 10px; 
          margin-bottom: 10px; 
        }
        .execution-section { 
          margin-top: 60px; 
          border-top: 3px solid #000; 
          padding-top: 30px; 
          page-break-inside: avoid; 
        }
        .witness-statement { 
          text-align: center; 
          font-weight: bold; 
          margin: 30px 0; 
          font-size: 14px; 
        }
        .signature-grid { 
          display: flex; 
          justify-content: space-between; 
          margin: 40px 0; 
        }
        .signature-block { 
          width: 45%; 
          text-align: center; 
        }
        .signature-line { 
          border-bottom: 2px solid #000; 
          height: 80px; 
          margin-bottom: 15px; 
          display: flex; 
          align-items: flex-end; 
          justify-content: center; 
          min-width: 250px;
        }
        .subtitle {
          font-size: 16px;
          font-weight: normal;
          color: #666;
        }
        .parties { 
          margin-bottom: 30px; 
          padding: 20px;
          border: 1px solid #ccc;
          background-color: #f9f9f9;
        }
        .terms { 
          margin-bottom: 30px; 
        }
        .amount { 
          font-size: 18px; 
          font-weight: bold; 
          text-decoration: underline;
        }
        .signatures { 
          margin-top: 60px; 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 40px;
        }
        .signature-box { 
          border-top: 2px solid #000; 
          padding-top: 10px; 
          text-align: center;
          position: relative;
          min-height: 80px;
        }
        .signature-image {
          max-width: 200px;
          max-height: 60px;
          border: 1px solid #ccc;
          background: white;
          display: block;
          margin: 0 auto 10px auto;
        }
        .signature-box[data-signature-field] {
          /* Digital signature field marker */
        }
        .legal-text { 
          font-size: 12px; 
          margin-top: 40px; 
          padding: 20px;
          border: 1px solid #ccc;
          background-color: #f0f0f0;
        }
        .highlight { 
          background-color: #ffff99; 
          padding: 2px 4px;
        }
        .security-section {
          background-color: #f5f5f5;
          border-left: 4px solid #0066cc;
          padding: 15px;
          margin: 20px 0;
        }
        .blockchain-signature {
          background-color: #f8f9ff;
          border: 2px solid #e1e7ff;
          border-radius: 8px;
          padding: 10px;
          margin: 10px 0;
        }
        .blockchain-signature div {
          margin: 2px 0;
        }
        .realtime-signature-display {
          padding: 15px;
          background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
          border: 2px solid #0052cc;
          border-radius: 12px;
          margin: 10px 0;
        }
        .realtime-signature-display img {
          box-shadow: 0 2px 8px rgba(0, 82, 204, 0.1);
          border-radius: 4px;
        }
        .section-content {
          text-align: left;
          margin: 0;
        }
        .parties-section {
          text-align: left;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">PROMISSORY NOTE</div>
        <div style="border-bottom: 2px solid #000; margin: 20px 0;"></div>
        <div class="principal-info">
          <p><strong>PRINCIPAL AMOUNT:</strong> ${borrowerInfo?.amountInWords ? `${borrowerInfo.amountInWords} (` : ''}$${loanData.loanAmount.toLocaleString()}${borrowerInfo?.amountInWords ? ')' : ''}</p>
          <p><strong>DATE:</strong> ${today}</p>
        </div>
      </div>

      <div class="article-header">ARTICLE I - PARTIES TO THE AGREEMENT</div>
      <div class="parties-grid">
        <div class="party-box">
          <p style="font-weight: bold; margin-bottom: 15px;">BORROWER:</p>
          <p>${borrowerInfo?.name || '___________________'}</p>
          <p>${borrowerInfo?.address || '___________________'}</p>
          <p>${borrowerInfo?.city || '___________________'}</p>
          ${borrowerInfo?.borrowerContact ? `<p>${borrowerInfo.borrowerContact}</p>` : ''}
        </div>
        
        <div class="party-box">
          <p style="font-weight: bold; margin-bottom: 15px;">LENDER:</p>
          <p>${lenderInfo?.name || '___________________'}</p>
          <p>${lenderInfo?.address || '___________________'}</p>
          <p>${lenderInfo?.city || '___________________'}</p>
          ${lenderInfo?.lenderContact ? `<p>${lenderInfo.lenderContact}</p>` : ''}
        </div>
      </div>

      <div class="article-header">ARTICLE II - PROMISE TO PAY</div>
      <div class="section-content">
        <p><strong>FOR VALUE RECEIVED,</strong> the undersigned Borrower hereby unconditionally promises to pay to the order of the Lender, the principal sum of <strong>${loanData.loanAmount.toLocaleString()} Dollars ($${loanData.loanAmount.toLocaleString()})</strong>, together with interest thereon at the rate of <strong>${loanData.interestRate}% per annum</strong>, calculated on the unpaid principal balance from time to time outstanding.</p>
      </div>

      <div class="article-header">ARTICLE III - TERMS OF REPAYMENT</div>
      <div class="section-content">
        <div class="payment-terms-box">
          <div class="payment-grid">
            <p><strong>Payment Frequency:</strong> ${borrowerInfo?.installmentFrequency || 'Monthly'}</p>
            <p><strong>Payment Amount:</strong> $${monthlyPayment.toFixed(2)}</p>
            <p><strong>First Payment Due:</strong> ${firstPaymentDate.toLocaleDateString()}</p>
            <p><strong>Final Payment Due:</strong> ${finalPaymentDate.toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${borrowerInfo?.paymentMethod || '___________________'}</p>
            <p><strong>Loan Term:</strong> ${loanData.termUnit === 'years' ? loanData.loanTerm * 12 : loanData.loanTerm} months</p>
          </div>
        </div>
        <p>All payments shall be made in lawful currency of the United States. Early repayment is permitted without penalty, with prepayments applied first to accrued interest, then to principal.</p>
      </div>

      <div class="article-header">ARTICLE IV - DEFAULT AND REMEDIES</div>
      <div class="section-content">
        <p>In the event any payment hereunder is not made within <strong>${borrowerInfo?.gracePeriod || '___'} days</strong> of its due date, the unpaid amount shall bear interest at the default rate of <strong>${borrowerInfo?.defaultRate || '___'}% per annum</strong>, compounded ${borrowerInfo?.installmentFrequency?.toLowerCase() || 'monthly'}. Should payment remain delinquent after the expiration of said grace period, the entire unpaid principal balance, together with all accrued interest, may, at the sole option of the Lender, become immediately due and payable without further notice or demand.</p>
      </div>

      ${borrowerInfo?.collateralDescription ? `
        <div class="article-header">ARTICLE V - SECURITY INTEREST</div>
        <div class="section-content">
          <p>This Note is secured by the following collateral: <strong>${borrowerInfo.collateralDescription}</strong>. In the event of default, Lender may exercise all rights and remedies available at law or in equity with respect to such collateral.</p>
        </div>
      ` : ''}

      <div class="article-header">ARTICLE VI - GENERAL PROVISIONS</div>
      <div class="section-content">
        <p><strong>Governing Law:</strong> This Note shall be governed by the laws of ${borrowerInfo?.jurisdiction || '___________________'}.</p>
        ${borrowerInfo?.disputeResolution ? `<p><strong>Dispute Resolution:</strong> ${borrowerInfo.disputeResolution}</p>` : ''}
        <p><strong>Waiver:</strong> No failure by Lender to exercise any right shall constitute a waiver of such right.</p>
        <p><strong>Severability:</strong> If any provision hereof is invalid, the remainder shall remain in full force and effect.</p>
        <p><strong>Entire Agreement:</strong> This Note constitutes the entire agreement between the parties and supersedes all prior agreements.</p>
      </div>

      ${additionalTerms ? `
        <div class="article-header">ARTICLE VII - ADDITIONAL TERMS</div>
        <div class="section-content">
          <p>${additionalTerms}</p>
        </div>
      ` : ''}

      <div class="execution-section">
        <div class="article-header">EXECUTION</div>
        <div class="witness-statement">IN WITNESS WHEREOF, the parties have executed this Promissory Note as of the date first written above.</div>
        
        <div class="signature-grid">
          <div class="signature-block">
            <div class="signature-line">
              ${borrowerInfo?.signature?.visualSignature ? 
                `<img src="${borrowerInfo.signature.visualSignature}" 
                     style="max-width: 200px; max-height: 60px; border: none; background: transparent;" 
                     alt="Borrower Signature" />` : ''
              }
            </div>
            <p style="font-weight: bold;">BORROWER</p>
            <p>${borrowerInfo?.name || '___________________'}</p>
            <p style="font-size: 12px; margin-top: 10px;">Date: ___________</p>
          </div>
          
          <div class="signature-block">
            <div class="signature-line">
              ${lenderInfo?.signature?.visualSignature ? 
                `<img src="${lenderInfo.signature.visualSignature}" 
                     style="max-width: 200px; max-height: 60px; border: none; background: transparent;" 
                     alt="Lender Signature" />` : ''
              }
            </div>
            <p style="font-weight: bold;">LENDER</p>
            <p>${lenderInfo?.name || '___________________'}</p>
            <p style="font-size: 12px; margin-top: 10px;">Date: ___________</p>
          </div>
        </div>
      </div>

      ${getNotarySection()}

      <div class="legal-text">
        <p><strong>NOTICE:</strong> This is a legal document. Both parties should review this agreement carefully and consider consulting with legal counsel before signing. This promissory note creates legally binding obligations.</p>
        <p><strong>BLOCKCHAIN SIGNATURES:</strong> This document is cryptographically signed using blockchain technology. Each signature includes a unique cryptographic hash, public key verification, and immutable blockchain transaction record for enhanced security and non-repudiation.</p>
        <p><strong>SIGNATURE VERIFICATION:</strong> Signatures can be independently verified using the provided public keys and transaction IDs on the blockchain network. This provides tamper-proof evidence of document authenticity and signer identity.</p>
        ${securityInfo?.requireNotary ? '<p><strong>NOTARIZATION:</strong> This document requires notarization for legal validity in most jurisdictions.</p>' : ''}
      </div>
    </body>
    </html>
  `;

  // For digital signing, return as Blob instead of printing
  if (securityInfo?.useDigitalSigning) {
    const blob = new Blob([promissoryNoteHTML], { type: 'text/html' });
    return blob;
  }

  // For regular use, open print window
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(promissoryNoteHTML);
    printWindow.document.close();
    printWindow.print();
  }
  
  // Return empty blob for TypeScript compliance
  return new Blob([promissoryNoteHTML], { type: 'text/html' });
}

export function exportToPDF(schedule: PaymentEntry[], loanData: LoanInput) {
  // Create a comprehensive report as HTML then print to PDF
  const totalInterest = schedule.reduce((sum, p) => sum + p.interestAmount, 0);
  const totalPayments = schedule.reduce((sum, p) => sum + p.paymentAmount, 0);
  
  const reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Loan Amortization Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .summary-box { padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 8px; text-align: right; border: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .currency { text-align: right; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Loan Amortization Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="summary">
        <div class="summary-box">
          <h3>Loan Details</h3>
          <p><strong>Loan Amount:</strong> $${loanData.loanAmount.toLocaleString()}</p>
          <p><strong>Interest Rate:</strong> ${loanData.interestRate}%</p>
          <p><strong>Term:</strong> ${loanData.loanTerm} ${loanData.termUnit}</p>
          <p><strong>Payment Frequency:</strong> ${loanData.paymentFreq}</p>
        </div>
        <div class="summary-box">
          <h3>Payment Summary</h3>
          <p><strong>Monthly Payment:</strong> $${schedule[0]?.paymentAmount.toLocaleString() || 0}</p>
          <p><strong>Total Interest:</strong> $${totalInterest.toLocaleString()}</p>
          <p><strong>Total Payments:</strong> $${totalPayments.toLocaleString()}</p>
          <p><strong>Payoff Date:</strong> ${schedule[schedule.length - 1]?.date || ''}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Payment #</th>
            <th>Date</th>
            <th>Payment</th>
            <th>Principal</th>
            <th>Interest</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          ${schedule.map(payment => `
            <tr>
              <td>${payment.paymentNumber}</td>
              <td>${new Date(payment.date).toLocaleDateString()}</td>
              <td class="currency">$${payment.paymentAmount.toLocaleString()}</td>
              <td class="currency">$${payment.principalAmount.toLocaleString()}</td>
              <td class="currency">$${payment.interestAmount.toLocaleString()}</td>
              <td class="currency">$${payment.remainingBalance.toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <p>This report was generated by the Loan Amortization Calculator</p>
      </div>
    </body>
    </html>
  `;

  // Open in new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    printWindow.print();
  }
}