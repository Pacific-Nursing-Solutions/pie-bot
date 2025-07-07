import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, ChevronDown, ChevronUp, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { loanInputSchema, type LoanInput } from "@shared/amort_calculator/schema";

interface LoanFormProps {
  onSubmit: (data: LoanInput) => void;
  initialData: LoanInput;
}

export default function LoanForm({ onSubmit, initialData }: LoanFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<LoanInput>({
    resolver: zodResolver(loanInputSchema),
    defaultValues: initialData,
  });

  const handleSubmit = (data: LoanInput) => {
    onSubmit(data);
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('en-US').format(Number(numericValue));
  };

  return (
    <Card className="neo-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl">
          <div className="p-2 rounded-lg bg-primary/10 mr-3">
            <Edit className="h-5 w-5 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Loan Details
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="loanAmount"
              render={({ field }) => (
                <FormItem className="relative group">
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent font-semibold z-10">$</span>
                      <Input
                        {...field}
                        type="text"
                        className="neo-input pl-10 pr-4 text-lg font-medium border-2 transition-all duration-300 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/20"
                        placeholder=""
                        value={field.value && field.value > 0 ? formatCurrency(field.value.toString()) : ''}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/[^\d]/g, '');
                          field.onChange(numericValue === '' ? '' : Number(numericValue));
                        }}
                      />
                      <FormLabel className={`floating-label text-muted-foreground group-focus-within:text-primary transition-colors ${field.value && field.value > 0 ? 'active' : ''}`}>
                        Loan Amount
                      </FormLabel>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem className="relative group">
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          className="neo-input pr-10 text-lg font-medium transition-all duration-300 focus:shadow-lg focus:shadow-accent/20"
                          placeholder=""
                          value={field.value > 0 ? field.value : ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-accent font-semibold">%</span>
                        <FormLabel className={`floating-label text-muted-foreground group-focus-within:text-accent transition-colors ${field.value && field.value > 0 ? 'active' : ''}`}>
                          Annual Interest Rate
                        </FormLabel>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="termUnit"
                render={({ field }) => (
                  <FormItem className="relative group">
                    <FormControl>
                      <div className="relative">
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <SelectTrigger className="neo-input text-lg font-medium transition-all duration-300 focus:shadow-lg focus:shadow-primary/20">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                          <SelectContent className="neo-card border-0">
                            <SelectItem value="years">Years</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormLabel className={`floating-label text-muted-foreground group-focus-within:text-primary transition-colors ${field.value === 'years' || field.value === 'months' ? 'active' : ''}`}>
                          Term Unit
                        </FormLabel>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="loanTerm"
              render={({ field }) => (
                <FormItem className="relative group">
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="number"
                        className="neo-input text-lg font-medium transition-all duration-300 focus:shadow-lg focus:shadow-primary/20"
                        placeholder=""
                        value={field.value > 0 ? field.value : ''}
                        onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                      <FormLabel className={`floating-label text-muted-foreground group-focus-within:text-primary transition-colors ${field.value && field.value > 0 ? 'active' : ''}`}>
                        Loan Term
                      </FormLabel>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="relative group">
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="date"
                        className="neo-input text-lg font-medium transition-all duration-300 focus:shadow-lg focus:shadow-primary/20"
                      />
                      <FormLabel className={`floating-label text-muted-foreground group-focus-within:text-primary transition-colors ${field.value ? 'active' : ''}`}>
                        Start Date
                      </FormLabel>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="compoundingFreq"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compounding</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="annually">Annually</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentFreq"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Freq.</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t border-border/30 pt-6 mt-6">
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="collapsible-header w-full rounded-lg p-4 hover:bg-muted/30 transition-all duration-300"
                  >
                    <span className="text-foreground font-medium">Advanced Options</span>
                    {showAdvanced ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="latePenalty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Late Payment Penalty (%)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="5.0"
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Interest Rate (%)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="18.0"
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>

            <Button
              type="submit"
              className="btn-neo w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-2xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              <Calculator className="h-5 w-5 mr-3" />
              Calculate Schedule
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
