import { useState } from "react";
import { Calendar, Download, Edit3, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PaymentEntry } from "@shared/schema";

interface AmortizationTableProps {
  schedule: PaymentEntry[];
  onPaymentEdit: (paymentNumber: number, newAmount: number) => void;
}

export default function AmortizationTable({ schedule, onPaymentEdit }: AmortizationTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPayment, setEditingPayment] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [yearlyView, setYearlyView] = useState(false);

  // Process data based on view type
  const processedData = yearlyView ? 
    generateYearlyView(schedule) : 
    schedule;

  const itemsPerPage = yearlyView ? 12 : 24; // Show fewer years per page
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = processedData.slice(startIndex, endIndex);

  // Generate yearly summary data
  function generateYearlyView(monthlySchedule: PaymentEntry[]) {
    const yearlyData: any[] = [];
    let currentYear = new Date(monthlySchedule[0]?.date).getFullYear();
    let yearData = {
      year: currentYear,
      totalPayments: 0,
      totalPrincipal: 0,
      totalInterest: 0,
      startingBalance: monthlySchedule[0]?.remainingBalance + monthlySchedule[0]?.principalAmount || 0,
      endingBalance: 0,
      paymentCount: 0
    };

    monthlySchedule.forEach((payment, index) => {
      const paymentYear = new Date(payment.date).getFullYear();
      
      if (paymentYear !== currentYear) {
        // Complete current year and start new one
        yearlyData.push(yearData);
        currentYear = paymentYear;
        yearData = {
          year: currentYear,
          totalPayments: 0,
          totalPrincipal: 0,
          totalInterest: 0,
          startingBalance: payment.remainingBalance + payment.principalAmount,
          endingBalance: 0,
          paymentCount: 0
        };
      }
      
      yearData.totalPayments += payment.paymentAmount;
      yearData.totalPrincipal += payment.principalAmount;
      yearData.totalInterest += payment.interestAmount;
      yearData.endingBalance = payment.remainingBalance;
      yearData.paymentCount++;
    });

    // Add the last year
    if (yearData.paymentCount > 0) {
      yearlyData.push(yearData);
    }

    return yearlyData;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const handleEditStart = (paymentNumber: number, currentAmount: number) => {
    setEditingPayment(paymentNumber);
    setEditValue(currentAmount.toString());
  };

  const handleEditSave = (paymentNumber: number) => {
    const newAmount = parseFloat(editValue);
    if (!isNaN(newAmount) && newAmount > 0) {
      onPaymentEdit(paymentNumber, newAmount);
    }
    setEditingPayment(null);
    setEditValue("");
  };

  const handleEditCancel = () => {
    setEditingPayment(null);
    setEditValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent, paymentNumber: number) => {
    if (e.key === 'Enter') {
      handleEditSave(paymentNumber);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const exportToCsv = () => {
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

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "amortization-schedule.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-slate-600 mr-2" />
            <h3 className="text-lg font-semibold text-slate-900">
              Amortization Schedule
            </h3>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setYearlyView(!yearlyView);
                setCurrentPage(1); // Reset to first page when switching views
              }}
              className="text-slate-600 hover:text-slate-900"
            >
              <Calendar className="h-4 w-4 mr-1" />
              {yearlyView ? "Monthly" : "Yearly"} View
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={exportToCsv}
              className="text-slate-600 hover:text-slate-900"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-slate-100 border-b-2 border-slate-200">
                {yearlyView ? (
                  <>
                    {/* Yearly View Headers */}
                    <TableHead className="font-semibold text-slate-700 w-20 text-center border-r border-slate-200">
                      Year
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 w-24 border-r-2 border-slate-300">
                      Payments
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 w-32 text-right bg-blue-100">
                      Total Payments
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 w-32 text-right bg-slate-100">
                      Total Principal
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 w-32 text-right bg-blue-50 border-r-2 border-slate-300">
                      Total Interest
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 w-36 text-right bg-gray-100">
                      Ending Balance
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 w-16 text-center">
                      -
                    </TableHead>
                  </>
                ) : (
                  <>
                    {/* Monthly View Headers */}
                    <TableHead className="font-semibold text-slate-700 w-16 text-center border-r border-slate-200">
                      #
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 w-24 border-r-2 border-slate-300">
                      Date
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 w-28 text-right bg-blue-100">
                      Payment
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 w-28 text-right bg-slate-100">
                      Principal
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 w-28 text-right bg-blue-50 border-r-2 border-slate-300">
                      Interest
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 w-32 text-right bg-gray-100">
                      Remaining Balance
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 w-16 text-center">
                      Edit
                    </TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((item, index) => (
                <TableRow 
                  key={yearlyView ? item.year : item.paymentNumber} 
                  className={`hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                  } ${!yearlyView && item.paymentNumber % 12 === 1 ? 'border-t-2 border-blue-200' : ''}`}
                >
                  {yearlyView ? (
                    <>
                      {/* Yearly View Cells */}
                      <TableCell className="font-bold text-slate-900 text-center border-r border-slate-200">
                        {item.year}
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium border-r-2 border-slate-300">
                        {item.paymentCount} payments
                      </TableCell>
                      <TableCell className="text-right font-semibold text-blue-700 bg-blue-50">
                        {formatCurrency(item.totalPayments)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-slate-700 bg-slate-50">
                        {formatCurrency(item.totalPrincipal)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-blue-600 bg-blue-25 border-r-2 border-slate-300">
                        {formatCurrency(item.totalInterest)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-gray-900 bg-gray-50 text-lg">
                        {formatCurrency(item.endingBalance)}
                      </TableCell>
                      <TableCell className="text-center">
                        -
                      </TableCell>
                    </>
                  ) : (
                    <>
                      {/* Monthly View Cells */}
                      <TableCell className="font-bold text-slate-900 text-center border-r border-slate-200">
                        {item.paymentNumber}
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium border-r-2 border-slate-300">
                        {formatDate(item.date)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-blue-700 bg-blue-50">
                        {editingPayment === item.paymentNumber ? (
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => handleKeyPress(e, item.paymentNumber)}
                            onBlur={() => handleEditSave(item.paymentNumber)}
                            className="w-24 h-8 text-sm text-right"
                            autoFocus
                          />
                        ) : (
                          <span 
                            className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                            onClick={() => handleEditStart(item.paymentNumber, item.paymentAmount)}
                          >
                            {formatCurrency(item.paymentAmount)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-slate-700 bg-slate-50">
                        {formatCurrency(item.principalAmount)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-blue-600 bg-blue-25 border-r-2 border-slate-300">
                        {formatCurrency(item.interestAmount)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-gray-900 bg-gray-50 text-lg">
                        {formatCurrency(item.remainingBalance)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStart(item.paymentNumber, item.paymentAmount)}
                          className="text-slate-400 hover:text-blue-600 h-8 w-8 p-0 hover:bg-blue-100 transition-colors"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              
              {/* Summary Row */}
              {schedule.length > 0 && (
                <TableRow className="bg-gradient-to-r from-slate-100 to-slate-200 border-t-2 border-slate-300 font-bold">
                  {yearlyView ? (
                    <>
                      <TableCell className="text-center text-slate-700 border-r border-slate-300">
                        Total
                      </TableCell>
                      <TableCell className="text-slate-700 border-r-2 border-slate-400">
                        {schedule.length} payments
                      </TableCell>
                      <TableCell className="text-right text-blue-800 bg-blue-100">
                        {formatCurrency(schedule.reduce((sum, p) => sum + p.paymentAmount, 0))}
                      </TableCell>
                      <TableCell className="text-right text-green-800 bg-green-100">
                        {formatCurrency(schedule.reduce((sum, p) => sum + p.principalAmount, 0))}
                      </TableCell>
                      <TableCell className="text-right text-amber-800 bg-amber-100 border-r-2 border-slate-400">
                        {formatCurrency(schedule.reduce((sum, p) => sum + p.interestAmount, 0))}
                      </TableCell>
                      <TableCell className="text-right text-slate-800 bg-slate-100">
                        Final: {formatCurrency(0)}
                      </TableCell>
                      <TableCell className="text-center bg-slate-100">
                        -
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="text-center text-slate-700 border-r border-slate-300">
                        Total
                      </TableCell>
                      <TableCell className="text-slate-700 border-r-2 border-slate-400">
                        {schedule.length} payments
                      </TableCell>
                      <TableCell className="text-right text-blue-800 bg-blue-100">
                        {formatCurrency(schedule.reduce((sum, p) => sum + p.paymentAmount, 0))}
                      </TableCell>
                      <TableCell className="text-right text-green-800 bg-green-100">
                        {formatCurrency(schedule.reduce((sum, p) => sum + p.principalAmount, 0))}
                      </TableCell>
                      <TableCell className="text-right text-amber-800 bg-amber-100 border-r-2 border-slate-400">
                        {formatCurrency(schedule.reduce((sum, p) => sum + p.interestAmount, 0))}
                      </TableCell>
                      <TableCell className="text-right text-slate-800 bg-slate-100">
                        Final: {formatCurrency(0)}
                      </TableCell>
                      <TableCell className="text-center bg-slate-100">
                        -
                      </TableCell>
                    </>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-sm text-slate-600">
                {yearlyView ? (
                  `Showing years ${startIndex + 1}-${Math.min(endIndex, processedData.length)} of ${processedData.length}`
                ) : (
                  `Showing payments ${startIndex + 1}-${Math.min(endIndex, processedData.length)} of ${processedData.length}`
                )}
              </div>
              {schedule.length > 0 && (
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">
                      {yearlyView ? (
                        `${processedData.length} years total`
                      ) : (
                        `Year ${Math.ceil(Math.min(endIndex, schedule.length) / 12)}`
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600">
                      {yearlyView ? (
                        `${Math.round((Math.min(endIndex, processedData.length) / processedData.length) * 100)}% years shown`
                      ) : (
                        `${Math.round((Math.min(endIndex, schedule.length) / schedule.length) * 100)}% complete`
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="px-3 py-1 text-sm bg-slate-600 text-white rounded h-8 flex items-center">
                {currentPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
