import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, PieChartIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { PaymentEntry, LoanInput } from "@shared/schema";

interface ChartsProps {
  schedule: PaymentEntry[];
  loanData: LoanInput;
}

export default function Charts({ schedule, loanData }: ChartsProps) {
  const totalPrincipal = loanData.loanAmount;
  const totalInterest = schedule.reduce((sum, payment) => sum + payment.interestAmount, 0);

  const pieData = [
    { name: "Principal", value: totalPrincipal, color: "#475569" },
    { name: "Interest", value: totalInterest, color: "#f59e0b" },
  ];

  const lineData = schedule
    .filter((_, index) => index % Math.max(1, Math.floor(schedule.length / 50)) === 0)
    .map((payment, index) => ({
      payment: index + 1,
      balance: payment.remainingBalance,
      date: new Date(payment.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      }),
    }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChartIcon className="h-5 w-5 text-slate-600 mr-2" />
            Interest vs Principal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-slate-600 rounded-full mr-2"></div>
              <span className="text-sm text-slate-600">
                Principal ({formatCurrency(totalPrincipal)})
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
              <span className="text-sm text-slate-600">
                Interest ({formatCurrency(totalInterest)})
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 text-slate-600 mr-2" />
            Remaining Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), "Balance"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#475569" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#475569" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
