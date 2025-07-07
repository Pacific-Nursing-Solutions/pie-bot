import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Calculator,
  User,
  LogOut,
  Crown,
  Download,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import amortLogo from "@assets/amort_calculator/Amort_1751377575673.png";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

import LoanForm from "@/components/amort_calculator/loan-form";
import PaymentSummary from "@/components/amort_calculator/payment-summary";
import Charts from "@/components/amort_calculator/charts";
import AmortizationTable from "@/components/amort_calculator/amortization-table";
import ExtraPayments from "@/components/amort_calculator/extra-payments";
import EnhancedExport from "@/components/amort_calculator/enhanced-export";
import AuthDialog from "@/components/amort_calculator/auth-dialog";
import SavedCalculationsDialog from "@/components/amort_calculator/saved-calculations-dialog";
import PremiumUpgradeDialog from "@/components/amort_calculator/premium-upgrade-dialog";
import PremiumFeaturesPanel from "@/components/amort_calculator/premium-features-panel";
import DigitalPromissoryNote from "@/components/amort_calculator/digital-promissory-note";
import {
  calculateAmortizationSchedule,
  calculatePaymentSummary,
} from "@/lib/amort_calculator/amortization";
import type {
  LoanInput,
  PaymentEntry,
  ExtraPayment,
} from "@shared/amort_calculator/schema";

// Initialize Stripe
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_...",
);

export default function CalculatorPage() {
  const [loanData, setLoanData] = useState<LoanInput>({
    loanAmount: "" as any,
    interestRate: "" as any,
    loanTerm: "" as any,
    termUnit: "" as any,
    startDate: "",
    compoundingFreq: "" as any,
    paymentFreq: "" as any,
  });

  const [schedule, setSchedule] = useState<PaymentEntry[]>([]);
  const [extraPayments, setExtraPayments] = useState<ExtraPayment[]>([]);
  const [user, setUser] = useState<any>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [savedDialogOpen, setSavedDialogOpen] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");

  const { toast } = useToast();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      // User not authenticated
    }
  };

  const handleFormSubmit = (data: LoanInput) => {
    setLoanData(data);
    const newSchedule = calculateAmortizationSchedule(data, extraPayments);
    setSchedule(newSchedule);
  };

  const handlePaymentEdit = (paymentNumber: number, newAmount: number) => {
    const updatedSchedule = [...schedule];
    const paymentIndex = updatedSchedule.findIndex(
      (p) => p.paymentNumber === paymentNumber,
    );

    if (paymentIndex !== -1) {
      // Recalculate schedule from this payment forward
      const recalculatedSchedule = calculateAmortizationSchedule(
        loanData,
        extraPayments,
        paymentNumber,
        newAmount,
      );
      setSchedule(recalculatedSchedule);
    }
  };

  const handleExtraPayment = (payment: ExtraPayment) => {
    const newExtraPayments = [...extraPayments, payment];
    setExtraPayments(newExtraPayments);

    // Recalculate schedule with extra payments
    const newSchedule = calculateAmortizationSchedule(
      loanData,
      newExtraPayments,
    );
    setSchedule(newSchedule);
  };

  const handleReset = () => {
    setLoanData({
      loanAmount: 250000,
      interestRate: 6.5,
      loanTerm: 30,
      termUnit: "years",
      startDate: "2024-01-01",
      compoundingFreq: "monthly",
      paymentFreq: "monthly",
    });
    setSchedule([]);
    setExtraPayments([]);
  };

  const handleSave = async (name: string) => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }

    try {
      const response = await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          loanData,
          schedule,
          extraPayments,
        }),
      });

      if (response.ok) {
        toast({
          title: "Calculation Saved",
          description: `"${name}" has been saved successfully`,
        });
      } else {
        const errorData = await response.json();
        if (response.status === 402) {
          toast({
            title: "Plan Limit Reached",
            description: errorData.error,
            variant: "destructive",
          });
        } else {
          throw new Error(errorData.error);
        }
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save calculation",
        variant: "destructive",
      });
    }
  };

  const handleLoad = (calculation: {
    loanData: LoanInput;
    schedule: PaymentEntry[];
    extraPayments: ExtraPayment[];
  }) => {
    setLoanData(calculation.loanData);
    setSchedule(calculation.schedule);
    setExtraPayments(calculation.extraPayments);
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    toast({
      title: "Welcome!",
      description: `Successfully signed in as ${userData.name}`,
    });
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handleUpgradeClick = () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }

    setUpgradeDialogOpen(true);
  };

  const handleUpgradeSuccess = (updatedUser: any) => {
    setUser(updatedUser);
    checkAuthStatus(); // Refresh user data
  };

  const paymentSummary = calculatePaymentSummary(loanData, schedule);

  return (
    <div className="min-h-screen neo-gradient-light dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="neo-card border-0 backdrop-blur-lg sticky top-0 z-50 mx-4 mt-4 rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => window.history.back()}
                      className="p-2 mr-3 rounded-full bg-muted/60 hover:bg-muted transition-colors shadow border border-muted-foreground/10"
                      aria-label="Go back"
                    >
                      <ArrowLeft className="h-5 w-5 text-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Go back</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div>
                <h1 className="text-base font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Loan Calculator
                </h1>
                <p className="text-xs text-muted-foreground leading-tight">
                  Advanced amortization analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-muted/30">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {user.name}
                    </span>
                    {user.isPremium && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : null}
              <Button
                variant="ghost"
                onClick={handleReset}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="relative inline-flex items-center justify-center mb-8 group">
            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl"></div>
            <div className="relative w-28 h-28 flex items-center justify-center transition-all duration-500 ease-in-out group-hover:scale-110">
              <img
                src={amortLogo}
                alt="Amortization Calculator"
                className="h-36 w-40 transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
              />
            </div>
            <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent mb-6">
            Loan Amortization Calculator
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            Calculate loan payments with precision. Break down principal and
            interest components while tracking remaining balance throughout your
            loan term.
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-accent/10">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-accent font-medium">
                Bank-grade accuracy
              </span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-primary font-medium">
                Professional exports
              </span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-muted/10">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
              <span className="text-muted-foreground font-medium">
                Real-time calculations
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-8">
          {/* Top Row: Loan Details (left) + Extra Payments (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 1. Loan Details Form */}
            <div className="w-full">
              <LoanForm onSubmit={handleFormSubmit} initialData={loanData} />
            </div>

            {/* 2. Extra Payments */}
            <div className="w-full">
              {schedule.length > 0 ? (
                <ExtraPayments
                  onAddPayment={handleExtraPayment}
                  schedule={schedule}
                  loanData={loanData}
                  extraPayments={extraPayments}
                />
              ) : (
                <Card className="p-8 text-center h-full flex flex-col justify-center">
                  <Calculator className="h-10 w-10 text-primary mx-auto mb-3 opacity-40" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Extra Payments
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Calculate your loan schedule first to add extra payments
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* 3. Payment Summary */}
          <div className="w-full">
            <PaymentSummary data={paymentSummary} />
          </div>

          {/* 4. Amortization Table */}
          {schedule.length > 0 && (
            <div className="w-full">
              <AmortizationTable
                schedule={schedule}
                onPaymentEdit={handlePaymentEdit}
              />
            </div>
          )}

          {/* 5. Charts Section */}
          {schedule.length > 0 ? (
            <div className="w-full">
              <Charts schedule={schedule} loanData={loanData} />
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Calculator className="h-12 w-12 text-primary mx-auto mb-4 opacity-40" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Payment Visualization
              </h3>
              <p className="text-gray-500">
                Fill out the loan details and click "Calculate Schedule" to see
                your payment charts and analysis.
              </p>
            </Card>
          )}

          {/* 6. Export & Save */}
          <div className="w-full">
            <EnhancedExport
              schedule={schedule}
              loanData={loanData}
              extraPayments={extraPayments}
              user={user}
              onSave={handleSave}
              onLoad={() => setSavedDialogOpen(true)}
              onUpgrade={handleUpgradeClick}
              onSignIn={() => setAuthDialogOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Authentication Dialog */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Saved Calculations Dialog */}
      <SavedCalculationsDialog
        open={savedDialogOpen}
        onOpenChange={setSavedDialogOpen}
        onLoad={handleLoad}
        user={user}
      />

      {/* Stripe Elements wrapper for payment processing */}
      <PremiumUpgradeDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        onUpgradeSuccess={handleUpgradeSuccess}
        clientSecret={clientSecret}
      />
    </div>
  );
}
