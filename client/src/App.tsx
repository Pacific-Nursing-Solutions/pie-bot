import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Portfolio from "@/pages/Portfolio";
import CompanyDashboard from "@/pages/CompanyDashboard";
import CompanyPieBot from "@/pages/CompanyPieBot";
import SimplePage from "@/components/SimplePage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Portfolio} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/company/:id/dashboard" component={CompanyDashboard} />
      <Route path="/company/:id/pie-bot" component={CompanyPieBot} />
      <Route path="/pie-bot" component={SimplePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
