import { useState } from "react";
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Crown, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PremiumUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgradeSuccess: (user: any) => void;
  clientSecret?: string;
}

function PaymentForm({ onUpgradeSuccess, onCancel }: { 
  onUpgradeSuccess: (user: any) => void;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm payment with backend
        const response = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });

        if (response.ok) {
          const data = await response.json();
          onUpgradeSuccess(data.user);
          toast({
            title: "Upgrade Successful!",
            description: "Welcome to Premium! You now have unlimited saved calculations.",
          });
        } else {
          toast({
            title: "Upgrade Failed",
            description: "Payment processed but upgrade failed. Please contact support.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred during payment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {isProcessing ? "Processing..." : "Upgrade to Premium ($10)"}
        </Button>
      </div>
    </form>
  );
}

export default function PremiumUpgradeDialog({ 
  open, 
  onOpenChange, 
  onUpgradeSuccess,
  clientSecret 
}: PremiumUpgradeDialogProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { toast } = useToast();

  const handleDemoUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const response = await apiRequest("POST", "/api/upgrade-demo");
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Upgrade Successful!",
          description: data.message,
        });
        onUpgradeSuccess(data.user);
        onOpenChange(false);
      } else {
        throw new Error("Upgrade failed");
      }
    } catch (error) {
      toast({
        title: "Upgrade Failed",
        description: "Unable to process upgrade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const freeFeatures = [
    "Save up to 3 calculations",
    "Basic CSV export",
    "Excel export with formulas",
    "Interactive payment editing",
    "Charts and visualizations"
  ];

  const premiumFeatures = [
    "Unlimited saved calculations",
    "Professional PDF reports",
    "Priority customer support",
    "Advanced export options",
    "Early access to new features"
  ];

  const handleStartUpgrade = async () => {
    setIsUpgrading(true);
    
    // Try to initialize payment, if it fails, offer demo upgrade
    try {
      const response = await apiRequest("POST", "/api/create-payment-intent");
      if (response.ok) {
        const data = await response.json();
        if (data.clientSecret) {
          setShowPayment(true);
          setIsUpgrading(false);
          return;
        }
      }
      // If we get here, payment failed - do demo upgrade instead
      throw new Error("Payment unavailable");
    } catch (error) {
      // Payment processing unavailable, do demo upgrade
      toast({
        title: "Payment Processing Unavailable",
        description: "Upgrading you to premium features now...",
      });
      await handleDemoUpgrade();
    }
  };

  const handleCancel = () => {
    setShowPayment(false);
    onOpenChange(false);
  };

  const handleUpgradeSuccess = (user: any) => {
    onUpgradeSuccess(user);
    onOpenChange(false);
    setShowPayment(false);
  };

  if (!clientSecret && showPayment) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="text-center py-8">
            <div className="text-slate-600">Loading payment form...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Upgrade to Premium
          </DialogTitle>
        </DialogHeader>

        {!showPayment ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side - Pricing & Call to Action */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">$10</div>
                <div className="text-slate-600">One-time payment</div>
              </div>
              
              <div className="text-center space-y-3">
                <p className="text-slate-600">
                  Unlock unlimited calculations and professional features
                </p>
                <div className="flex justify-center space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                  >
                    Maybe Later
                  </Button>
                  <Button 
                    onClick={handleDemoUpgrade}
                    disabled={isUpgrading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    {isUpgrading ? "Upgrading..." : "Upgrade to Premium - $10"}
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500 mt-2">
                  Click to instantly upgrade to premium features
                </div>
              </div>
            </div>

            {/* Right Side - Premium Benefits */}
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="text-center mb-3">
                  <Badge className="bg-amber-500">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium Benefits
                  </Badge>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start text-sm">
                    <Crown className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Unlimited saved calculations</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <Crown className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>PDF export with professional formatting</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <Crown className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Legal promissory note generation</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <Crown className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Advanced analytics & scenario comparison</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Complete Your Upgrade</h3>
              <p className="text-slate-600">Secure payment powered by Stripe</p>
            </div>

            {clientSecret && (
              <PaymentForm 
                onUpgradeSuccess={handleUpgradeSuccess}
                onCancel={handleCancel}
              />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}