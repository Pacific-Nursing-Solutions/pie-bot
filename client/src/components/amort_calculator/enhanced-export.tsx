import { useState } from "react";
import { Download, FileText, FileSpreadsheet, Save, FolderOpen, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { exportToCSV, exportToExcel, exportToPDF, exportAdvancedAnalytics, exportScenarioComparison } from "@/lib/amort_calculator/export";
import DigitalPromissoryNote from "@/components/amort_calculator/digital-promissory-note";
import type { PaymentEntry, LoanInput, ExtraPayment } from "@shared/schema";

interface EnhancedExportProps {
  schedule: PaymentEntry[];
  loanData: LoanInput;
  extraPayments: ExtraPayment[];
  user?: any;
  onSave?: (name: string) => void;
  onLoad?: () => void;
  onUpgrade?: () => void;
  onSignIn?: () => void;
}

export default function EnhancedExport({
  schedule,
  loanData,
  extraPayments,
  user,
  onSave,
  onLoad,
  onUpgrade,
  onSignIn
}: EnhancedExportProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!saveName.trim() || !onSave) return;

    setIsSaving(true);
    try {
      await onSave(saveName.trim());
      setSaveDialogOpen(false);
      setSaveName("");
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const exportOptions = [
    {
      icon: FileText,
      title: "CSV Export",
      description: "Raw data for spreadsheet analysis",
      action: () => exportToCSV(schedule, loanData),
      premium: false
    },
    {
      icon: FileSpreadsheet,
      title: "Excel Export",
      description: "Advanced analysis with formulas and formatting",
      action: () => exportToExcel(schedule, loanData),
      premium: false
    },
    {
      icon: FileText,
      title: "PDF Report",
      description: "Professional report for sharing",
      action: () => exportToPDF(schedule, loanData),
      premium: true
    },
    {
      icon: FileText,
      title: "Advanced Analytics",
      description: "Detailed financial insights & ROI analysis",
      action: () => exportAdvancedAnalytics(schedule, loanData, extraPayments),
      premium: true
    },
    {
      icon: FileSpreadsheet,
      title: "Scenario Comparison",
      description: "Compare multiple loan terms side-by-side",
      action: () => exportScenarioComparison(loanData),
      premium: true
    }
  ];

  const canUsePremiumFeatures = user?.isPremium;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Download className="h-5 w-5 text-slate-600 mr-2" />
            Export & Save
          </div>
          {user && (
            <Badge variant={user.isPremium ? "default" : "secondary"}>
              {user.isPremium ? "Premium" : "Free"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export Options */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900">Export Options</h4>
          {exportOptions.map((option) => {
            const Icon = option.icon;
            const isDisabled = option.premium && !canUsePremiumFeatures;

            return (
              <div
                key={option.title}
                className={`flex items-center justify-between p-3 border rounded-lg ${isDisabled ? 'opacity-50 bg-slate-50' : 'hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-4 w-4 text-slate-600" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{option.title}</span>
                      {option.premium && (
                        <Crown className="h-3 w-3 text-amber-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{option.description}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={option.action}
                  disabled={isDisabled}
                >
                  Export
                </Button>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Save/Load Options */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900">Save & Load</h4>

          {user ? (
            <div className="space-y-2">
              <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" disabled={schedule.length === 0}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Calculation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Calculation</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="save-name">Calculation Name</Label>
                      <Input
                        id="save-name"
                        value={saveName}
                        onChange={(e) => setSaveName(e.target.value)}
                        placeholder="e.g., Home Mortgage 2024"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setSaveDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={!saveName.trim() || isSaving}
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="w-full" onClick={onLoad}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Load Saved Calculations
              </Button>

              {!user.isPremium && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">
                      Free Plan: 3 calculations max
                    </span>
                  </div>
                  <p className="text-xs text-amber-700 mt-1">
                    Upgrade to Premium for unlimited saves and PDF exports
                  </p>
                  <Button
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 mt-2"
                    onClick={() => onUpgrade && onUpgrade()}
                  >
                    Upgrade to Premium - $10
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 border border-slate-200 rounded-lg text-center">
              <p className="text-slate-600 mb-3">Sign in to save and load calculations</p>
              <Button variant="outline" size="sm" onClick={onSignIn}>
                Sign In
              </Button>
            </div>
          )}
        </div>

        {/* Legal Documents */}
        <Separator />
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900">Legal Documents</h4>
          <DigitalPromissoryNote
            loanData={loanData}
            disabled={!canUsePremiumFeatures}
          />
          {!canUsePremiumFeatures && (
            <p className="text-xs text-slate-500 mt-1">
              Premium feature -
              <button
                onClick={onUpgrade}
                className="text-blue-600 hover:text-blue-700 underline ml-1"
              >
                upgrade to unlock
              </button>
            </p>
          )}
        </div>

        {/* Quick Stats */}
        {schedule.length > 0 && (
          <>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Total Payments:</span>
                <div className="font-medium">{schedule.length}</div>
              </div>
              <div>
                <span className="text-slate-600">File Size:</span>
                <div className="font-medium">~{Math.round(schedule.length * 0.1)}KB</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}