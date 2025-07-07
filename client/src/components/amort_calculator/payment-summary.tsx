import { Info, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PaymentSummaryProps {
  data: {
    monthlyPayment: number;
    totalInterest: number;
    totalPayments: number;
    payoffDate: string;
  };
}

export default function PaymentSummary({ data }: PaymentSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const principal = data.totalPayments - data.totalInterest;
  const interestPercentage = (data.totalInterest / data.totalPayments) * 100;
  const principalPercentage = 100 - interestPercentage;

  return (
    <Card className="summary-widget">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl">
          <div className="p-2 rounded-lg bg-accent/10 mr-3">
            <Info className="h-5 w-5 text-accent" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
            Payment Summary
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Payment Info */}
        <div className="summary-item bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-xl">
          <div className="flex items-center justify-between min-h-[3rem]">
            <div className="flex items-center space-x-4 flex-1">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground font-medium text-base leading-relaxed">Monthly Payment</span>
            </div>
            <div className="flex-shrink-0 ml-8">
              <span className="summary-value text-2xl font-semibold leading-relaxed tracking-wide block">
                {formatCurrency(data.monthlyPayment)}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Payment Breakdown</h4>
          
          {/* Mini Chart */}
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 32 32">
                <circle
                  cx="16" cy="16" r="14"
                  fill="transparent"
                  stroke="hsl(var(--muted))"
                  strokeWidth="4"
                />
                <circle
                  cx="16" cy="16" r="14"
                  fill="transparent"
                  stroke="hsl(var(--primary))"
                  strokeWidth="4"
                  strokeDasharray={`${principalPercentage * 0.88} 88`}
                  strokeLinecap="round"
                />
                <circle
                  cx="16" cy="16" r="14"
                  fill="transparent"
                  stroke="hsl(var(--accent))"
                  strokeWidth="4"
                  strokeDasharray={`${interestPercentage * 0.88} 88`}
                  strokeDashoffset={`-${principalPercentage * 0.88}`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="summary-item">
                <div className="flex items-center justify-between min-h-[2.5rem]">
                  <div className="flex items-center flex-1">
                    <span className="text-muted-foreground text-base leading-relaxed">Principal</span>
                  </div>
                  <div className="flex-shrink-0 ml-6">
                    <span className="summary-value font-semibold leading-relaxed tracking-wide block">
                      {formatCurrency(principal)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="summary-item">
                <div className="flex items-center justify-between min-h-[2.5rem]">
                  <div className="flex items-center flex-1">
                    <span className="text-muted-foreground text-base leading-relaxed">Interest</span>
                  </div>
                  <div className="flex-shrink-0 ml-6">
                    <span className="summary-value text-accent font-semibold leading-relaxed tracking-wide block">
                      {formatCurrency(data.totalInterest)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-4 pt-6 border-t border-border/30">
          <div className="summary-item">
            <div className="flex items-center justify-between min-h-[2.5rem]">
              <div className="flex items-center space-x-3 flex-1">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-base leading-relaxed">Total Payments</span>
              </div>
              <div className="flex-shrink-0 ml-8">
                <span className="summary-value font-semibold leading-relaxed tracking-wide block">
                  {formatCurrency(data.totalPayments)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="summary-item">
            <div className="flex items-center justify-between min-h-[2.5rem]">
              <div className="flex items-center space-x-3 flex-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-base leading-relaxed">Payoff Date</span>
              </div>
              <div className="flex-shrink-0 ml-8">
                <span className="summary-value text-accent font-semibold leading-relaxed tracking-wide block">
                  {data.payoffDate || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
