import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PrivyProvider } from '@privy-io/react-auth';
import { privyConfig } from './lib/privy-config';
import PieTerminal from "@/components/PersistentPieBot";
import UserDashboard from "@/pages/UserDashboard";
import Companies from "@/pages/Companies";
import CompanyPositions from "@/pages/CompanyPositions";
import Management from "@/pages/Management";
import Settings from "@/pages/Settings";
import Pools from "@/pages/Pools";
import Fundraising from "@/pages/Fundraising";
import Documents from "@/pages/Documents";
import Portfolio from "@/pages/Portfolio";
import CompanyDashboard from "@/pages/CompanyDashboard";
import CompanyPieBot from "@/pages/CompanyPieBot";
import CompanyWallets from "@/pages/CompanyWallets";
import SimplePage from "@/components/SimplePage";
import NotFound from "@/pages/not-found";

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
      <Route path="/management" component={Management} />
      <Route path="/documents" component={Documents} />
      <Route path="/settings" component={Settings} />
      <Route path="/company-positions" component={CompanyPositions} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/company/:id/pie-bot" component={CompanyPieBot} />
      <Route path="/pie-bot" component={SimplePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <PrivyProvider
      appId={privyConfig.appId}
      config={privyConfig.config}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Command Center Layout */}
            <div className="max-w-7xl mx-auto px-4 py-8">
              {/* Pie Bot Terminal - The Star */}
              <div className="mb-8">
                <a href="/" className="block hover:opacity-80 transition-opacity">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
                    🥧 Pie Bot
                  </h1>
                </a>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Your terminal for equity management, financial operations, and business control
                </p>
                <PieTerminal />
              </div>
              
              {/* Page Content Around Terminal */}
              <Router />
            </div>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

export default App;
