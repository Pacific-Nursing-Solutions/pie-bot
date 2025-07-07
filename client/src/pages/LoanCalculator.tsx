import { useState } from 'react';
import { Link } from 'wouter';
import { Calculator, ArrowLeft, DollarSign, Calendar, Percent, TrendingUp } from 'lucide-react';

interface LoanCalculation {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  paymentSchedule: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState<string>('100000');
  const [interestRate, setInterestRate] = useState<string>('5.5');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [calculation, setCalculation] = useState<LoanCalculation | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(loanTerm) * 12;

    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      return;
    }

    // Calculate monthly payment using the formula
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    // Generate payment schedule (first 12 months)
    const paymentSchedule = [];
    let remainingBalance = principal;

    for (let i = 1; i <= Math.min(12, numberOfPayments); i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      paymentSchedule.push({
        month: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: remainingBalance
      });
    }

    setCalculation({
      monthlyPayment,
      totalPayment,
      totalInterest,
      paymentSchedule
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <button className="flex items-center px-3 py-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Calculator className="w-6 h-6 mr-3 text-green-600" />
            Loan Calculator
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Input */}
        <div className="card-default">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Loan Details
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Loan Amount
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="100,000"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Percent className="w-4 h-4 inline mr-1" />
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="5.5"
              />
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Loan Term (Years)
              </label>
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="30"
              />
            </div>

            <button
              onClick={calculateLoan}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Loan
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="card-default">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Loan Summary
            </h2>
          </div>
          
          <div className="p-6">
            {calculation ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">Monthly Payment</div>
                    <div className="text-2xl font-bold text-green-800 dark:text-green-300">
                      ${calculation.monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Payment</div>
                    <div className="text-xl font-bold text-blue-800 dark:text-blue-300">
                      ${calculation.totalPayment.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                    <div className="text-sm font-medium text-orange-600 dark:text-orange-400">Total Interest</div>
                    <div className="text-xl font-bold text-orange-800 dark:text-orange-300">
                      ${calculation.totalInterest.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Interest %</div>
                    <div className="text-xl font-bold text-gray-800 dark:text-gray-300">
                      {((calculation.totalInterest / parseFloat(loanAmount)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Payment Schedule Preview */}
                <div>
                  <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    First Year Payment Schedule
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="text-left py-2 font-medium text-gray-700 dark:text-gray-300">Month</th>
                          <th className="text-right py-2 font-medium text-gray-700 dark:text-gray-300">Payment</th>
                          <th className="text-right py-2 font-medium text-gray-700 dark:text-gray-300">Principal</th>
                          <th className="text-right py-2 font-medium text-gray-700 dark:text-gray-300">Interest</th>
                          <th className="text-right py-2 font-medium text-gray-700 dark:text-gray-300">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculation.paymentSchedule.map((payment) => (
                          <tr key={payment.month} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-2 text-gray-900 dark:text-gray-100">{payment.month}</td>
                            <td className="py-2 text-right text-gray-900 dark:text-gray-100">
                              ${payment.payment.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-2 text-right text-green-600 dark:text-green-400">
                              ${payment.principal.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-2 text-right text-orange-600 dark:text-orange-400">
                              ${payment.interest.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-2 text-right text-gray-600 dark:text-gray-400">
                              ${payment.balance.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Enter loan details and click "Calculate Loan" to see your payment breakdown
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;