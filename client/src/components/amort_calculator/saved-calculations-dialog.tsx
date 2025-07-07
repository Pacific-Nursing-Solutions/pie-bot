import { useState, useEffect } from "react";
import { Trash2, Calendar, DollarSign, FolderOpen, Crown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { SavedCalculation, LoanInput, PaymentEntry, ExtraPayment } from "@shared/schema";

interface SavedCalculationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoad: (calculation: {
    loanData: LoanInput;
    schedule: PaymentEntry[];
    extraPayments: ExtraPayment[];
  }) => void;
  user?: any;
}

export default function SavedCalculationsDialog({ 
  open, 
  onOpenChange, 
  onLoad, 
  user 
}: SavedCalculationsDialogProps) {
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && user) {
      fetchCalculations();
    }
  }, [open, user]);

  const fetchCalculations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/calculations");
      if (response.ok) {
        const data = await response.json();
        setCalculations(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch saved calculations",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch saved calculations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = (calculation: SavedCalculation) => {
    try {
      const loanData = typeof calculation.loanData === 'string' 
        ? JSON.parse(calculation.loanData) 
        : calculation.loanData;
      const schedule = typeof calculation.schedule === 'string' 
        ? JSON.parse(calculation.schedule) 
        : calculation.schedule;
      const extraPayments = typeof calculation.extraPayments === 'string' 
        ? JSON.parse(calculation.extraPayments) 
        : calculation.extraPayments;

      onLoad({
        loanData: loanData as LoanInput,
        schedule: schedule as PaymentEntry[],
        extraPayments: extraPayments as ExtraPayment[],
      });
      onOpenChange(false);
      toast({
        title: "Calculation Loaded",
        description: `"${calculation.name}" has been loaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Load Error",
        description: "Failed to load calculation data",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/calculations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCalculations(calculations.filter(calc => calc.id !== id));
        toast({
          title: "Calculation Deleted",
          description: "The calculation has been deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete calculation",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete calculation",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Saved Calculations
            </DialogTitle>
            <Badge variant={user.isPremium ? "default" : "secondary"}>
              {calculations.length}/{user.isPremium ? "∞" : "3"}
            </Badge>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-slate-600">Loading calculations...</div>
          </div>
        ) : calculations.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Saved Calculations</h3>
            <p className="text-slate-600">
              Save your loan calculations to access them later
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {calculations.map((calculation) => (
              <Card key={calculation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-2">
                        {calculation.name}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatCurrency((calculation.loanData as any).loanAmount)}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {(calculation.loanData as any).loanTerm} {(calculation.loanData as any).termUnit}
                        </div>
                        <div>
                          Rate: {(calculation.loanData as any).interestRate}%
                        </div>
                        <div>
                          Payments: {calculation.schedule.length}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          Saved on {formatDate(calculation.createdAt?.toString() || '')}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLoad(calculation)}
                          >
                            Load
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(calculation.id)}
                            disabled={deletingId === calculation.id}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!user.isPremium && calculations.length >= 3 && (
          <>
            <Separator />
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-800">Free Plan Limit Reached</span>
              </div>
              <p className="text-sm text-amber-700 mb-3">
                You've reached the maximum of 3 saved calculations. Upgrade to Premium for unlimited storage.
              </p>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                Upgrade to Premium
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}