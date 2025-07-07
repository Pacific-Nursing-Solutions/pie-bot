import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { calculateAmortizationSchedule, calculateExtraPaymentSavings } from "@/lib/amort_calculator/amortization";
import { extraPaymentSchema, type ExtraPayment, type PaymentEntry, type LoanInput } from "@shared/amort_calculator/schema";

interface ExtraPaymentsProps {
  onAddPayment: (payment: ExtraPayment) => void;
  schedule: PaymentEntry[];
  loanData: LoanInput;
  extraPayments: ExtraPayment[];
}

export default function ExtraPayments({ onAddPayment, schedule, loanData, extraPayments }: ExtraPaymentsProps) {
  const form = useForm<ExtraPayment>({
    resolver: zodResolver(extraPaymentSchema),
    defaultValues: {
      amount: undefined as any,
      paymentDate: "",
    },
  });

  const handleSubmit = (data: ExtraPayment) => {
    console.log("Extra payment submitted:", data);

    // Validate that we have required data
    if (!data.amount || data.amount <= 0) {
      console.error("Invalid amount:", data.amount);
      return;
    }

    if (!data.paymentDate) {
      console.error("Missing payment date");
      return;
    }

    // Find the payment number for the given date
    const targetDate = new Date(data.paymentDate);
    const paymentEntry = schedule.find(p => new Date(p.date) >= targetDate);
    const paymentNumber = paymentEntry ? paymentEntry.paymentNumber : schedule.length;

    const extraPayment = {
      amount: data.amount,
      paymentDate: data.paymentDate,
      paymentNumber,
    };

    console.log("Calling onAddPayment with:", extraPayment);
    onAddPayment(extraPayment);

    // Reset form with proper values
    form.reset();
    form.setValue("amount", undefined as any);
    form.setValue("paymentDate", "");
  };

  // Calculate savings from extra payments
  const originalSchedule = calculateAmortizationSchedule(loanData, []);
  const savings = schedule.length > 0 && extraPayments.length > 0
    ? calculateExtraPaymentSavings(originalSchedule, schedule)
    : { interestSaved: 0, timeSaved: "0 months" };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PlusCircle className="h-5 w-5 text-slate-600 mr-2" />
          Extra Payments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          className="pl-8"
                          placeholder="Enter amount"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  Add Payment
                </Button>
              </div>
            </div>
          </form>
        </Form>

        {extraPayments.length > 0 && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Interest Saved:</span>
              <span className="font-semibold text-emerald-600">
                {formatCurrency(savings.interestSaved)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-slate-600">Time Saved:</span>
              <span className="font-semibold text-emerald-600">
                {savings.timeSaved}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
