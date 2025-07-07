import type { LoanInput, PaymentEntry, ExtraPayment } from "@shared/schema";

export function calculateAmortizationSchedule(
  loanData: LoanInput,
  extraPayments: ExtraPayment[] = [],
  startFromPayment: number = 1,
  customPaymentAmount?: number
): PaymentEntry[] {
  const {
    loanAmount,
    interestRate,
    loanTerm,
    termUnit,
    startDate,
    paymentFreq,
  } = loanData;

  // Convert annual interest rate to period rate
  const annualRate = interestRate / 100;
  let periodsPerYear: number;
  
  switch (paymentFreq) {
    case "monthly":
      periodsPerYear = 12;
      break;
    case "bi-weekly":
      periodsPerYear = 26;
      break;
    case "weekly":
      periodsPerYear = 52;
      break;
    default:
      periodsPerYear = 12;
  }

  const periodRate = annualRate / periodsPerYear;
  const totalPeriods = termUnit === "years" ? loanTerm * periodsPerYear : loanTerm;

  // Calculate standard payment amount using the amortization formula
  const standardPayment = 
    (loanAmount * periodRate * Math.pow(1 + periodRate, totalPeriods)) /
    (Math.pow(1 + periodRate, totalPeriods) - 1);

  const schedule: PaymentEntry[] = [];
  let remainingBalance = loanAmount;
  const startDateObj = new Date(startDate);

  for (let period = 1; period <= totalPeriods && remainingBalance > 0.01; period++) {
    // Calculate payment date
    let paymentDate = new Date(startDateObj);
    
    switch (paymentFreq) {
      case "monthly":
        paymentDate.setMonth(paymentDate.getMonth() + period - 1);
        break;
      case "bi-weekly":
        paymentDate.setDate(paymentDate.getDate() + (period - 1) * 14);
        break;
      case "weekly":
        paymentDate.setDate(paymentDate.getDate() + (period - 1) * 7);
        break;
    }

    // Calculate interest for this period
    const interestAmount = remainingBalance * periodRate;
    
    // Determine payment amount
    let paymentAmount = standardPayment;
    if (period === startFromPayment && customPaymentAmount !== undefined) {
      paymentAmount = customPaymentAmount;
    }

    // Check for extra payments
    const extraPayment = extraPayments.find(ep => ep.paymentNumber === period);
    if (extraPayment) {
      paymentAmount += extraPayment.amount;
    }

    // Calculate principal amount
    let principalAmount = paymentAmount - interestAmount;
    
    // Ensure we don't overpay
    if (principalAmount > remainingBalance) {
      principalAmount = remainingBalance;
      paymentAmount = principalAmount + interestAmount;
    }

    // Update remaining balance
    remainingBalance -= principalAmount;

    schedule.push({
      paymentNumber: period,
      date: paymentDate.toISOString().split('T')[0],
      paymentAmount: Math.round(paymentAmount * 100) / 100,
      principalAmount: Math.round(principalAmount * 100) / 100,
      interestAmount: Math.round(interestAmount * 100) / 100,
      remainingBalance: Math.round(remainingBalance * 100) / 100,
    });

    // Break if loan is paid off
    if (remainingBalance <= 0.01) break;
  }

  return schedule;
}

export function calculatePaymentSummary(loanData: LoanInput, schedule: PaymentEntry[]) {
  if (schedule.length === 0) {
    return {
      monthlyPayment: 0,
      totalInterest: 0,
      totalPayments: 0,
      payoffDate: "",
    };
  }

  const monthlyPayment = schedule[0]?.paymentAmount || 0;
  const totalInterest = schedule.reduce((sum, payment) => sum + payment.interestAmount, 0);
  const totalPayments = schedule.reduce((sum, payment) => sum + payment.paymentAmount, 0);
  const payoffDate = schedule[schedule.length - 1]?.date || "";

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayments: Math.round(totalPayments * 100) / 100,
    payoffDate: new Date(payoffDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    }),
  };
}

export function calculateExtraPaymentSavings(
  originalSchedule: PaymentEntry[],
  newSchedule: PaymentEntry[]
) {
  const originalTotalInterest = originalSchedule.reduce((sum, p) => sum + p.interestAmount, 0);
  const newTotalInterest = newSchedule.reduce((sum, p) => sum + p.interestAmount, 0);
  const interestSaved = originalTotalInterest - newTotalInterest;
  
  const monthsSaved = originalSchedule.length - newSchedule.length;
  const yearsSaved = Math.floor(monthsSaved / 12);
  const remainingMonths = monthsSaved % 12;
  
  return {
    interestSaved: Math.round(interestSaved * 100) / 100,
    timeSaved: yearsSaved > 0 
      ? `${yearsSaved} year${yearsSaved > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`
      : `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`,
  };
}
