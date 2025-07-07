import { Crown, FileText, TrendingUp, Calculator, Shield, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PremiumFeaturesPanelProps {
  user?: any;
  onUpgrade?: () => void;
}

export default function PremiumFeaturesPanel({ user, onUpgrade }: PremiumFeaturesPanelProps) {
  if (user?.isPremium) {
    return (
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-800">
            <Crown className="h-5 w-5 text-amber-600 mr-2" />
            Premium Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-amber-700">
              <Shield className="h-4 w-4 mr-2" />
              Unlimited saved calculations
            </div>
            <div className="flex items-center text-sm text-amber-700">
              <FileText className="h-4 w-4 mr-2" />
              Advanced analytics & reports
            </div>
            <div className="flex items-center text-sm text-amber-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              Scenario comparison tools
            </div>
            <div className="flex items-center text-sm text-amber-700">
              <Zap className="h-4 w-4 mr-2" />
              Professional PDF exports
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Crown className="h-5 w-5 text-slate-600 mr-2" />
            Upgrade to Premium
          </div>
          <Badge variant="secondary">$10</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900 mb-1">$10</div>
          <div className="text-sm text-slate-600">One-time payment</div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium text-slate-900 text-sm">Premium Features</h4>
          <div className="space-y-2">
            <div className="flex items-start text-sm">
              <Shield className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Unlimited saved calculations</span>
            </div>
            <div className="flex items-start text-sm">
              <FileText className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Advanced analytics & financial insights</span>
            </div>
            <div className="flex items-start text-sm">
              <TrendingUp className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Scenario comparison reports</span>
            </div>
            <div className="flex items-start text-sm">
              <Calculator className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Professional PDF exports</span>
            </div>
            <div className="flex items-start text-sm">
              <Zap className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Priority customer support</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="font-medium text-slate-900 text-sm">Value Comparison</h4>
          <div className="text-xs text-slate-600 space-y-1">
            <div>• Professional financial consultant: $200/hour</div>
            <div>• Premium loan software: $50/month</div>
            <div>• Our premium features: $10 one-time</div>
          </div>
        </div>

        <Button 
          onClick={onUpgrade}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Crown className="h-4 w-4 mr-2" />
          Upgrade Now - $10
        </Button>

        <div className="text-xs text-slate-500 text-center">
          Secure payment powered by Stripe
        </div>
      </CardContent>
    </Card>
  );
}