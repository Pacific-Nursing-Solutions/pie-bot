import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PieTerminal from "@/components/CleanPieTerminal";
import AccessibilityTest from "@/components/AccessibilityTest";
import { PieBotLogo } from "@/components/PieBotLogo";
// Error handling removed for now - focusing on core functionality
import UserDashboard from "@/pages/UserDashboard";
import Companies from "@/pages/Companies";
import LoanCalculator from "@/pages/LoanCalculator";

import Settings from "@/pages/Settings";
import Pools from "@/pages/Pools";
import Fundraising from "@/pages/Fundraising";
import Documents from "@/pages/Documents";

import CompanyDashboard from "@/pages/CompanyDashboard";
import CompanyPieBot from "@/pages/CompanyPieBot";
import CompanyWallets from "@/pages/CompanyWallets";
import SimplePage from "@/components/SimplePage";
import NotFound from "@/pages/not-found";
import CalculatorPage from "./pages/amort_calculator/calculator";

function Router() {
  return (
    <Switch>
      <Route path="/" component={UserDashboard} />
      <Route path="/companies" component={Companies} />
      <Route path="/company/:id/dashboard" component={CompanyDashboard} />
      <Route path="/company/:id/pools" component={Pools} />
      <Route path="/company/:id/fundraising" component={Fundraising} />
      <Route path="/company/:id/documents" component={Documents} />
      <Route path="/company/:id/wallets" component={CompanyWallets} />

      <Route path="/documents" component={Documents} />
      <Route path="/loan-calculator" component={LoanCalculator} />
      <Route path="/settings" component={Settings} />

      <Route path="/company/:id/pie-bot" component={CompanyPieBot} />
      <Route path="/pie-bot" component={SimplePage} />

      <Route path="/calculator" component={CalculatorPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <a href="/" className="block hover:opacity-80 transition-opacity">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center flex items-center justify-center gap-3">
              <PieBotLogo size={32} />
              Pie Bot
            </h1>
          </a>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Your terminal for equity management, financial operations, and business control
          </p>
          <PieTerminal />
        </div>
        <Router />
      </div>
    </div>
  );
}

function App() {
  const [location] = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {location === "/calculator" ? (
          <CalculatorPage />
        ) : (
          <MainLayout />
        )}
        <AccessibilityTest />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
