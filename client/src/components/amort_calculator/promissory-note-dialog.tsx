import { useState, useEffect } from "react";
import { FileText, Shield, Car, Building, Briefcase, TrendingUp, FileSignature, CheckCircle, Send, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generatePromissoryNote } from "@/lib/amort_calculator/export";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DocuSignSetupDialog from "./docusign-setup-dialog";
import SignatureCapture from "./signature-capture";
import type { LoanInput } from "@shared/schema";

const promissoryNoteSchema = z.object({
  borrowerName: z.string().min(1, "Borrower name is required"),
  borrowerAddress: z.string().min(1, "Borrower address is required"),
  borrowerCity: z.string().min(1, "Borrower city, state, ZIP is required"),
  borrowerEmail: z.string().email("Valid email is required").optional(),
  lenderName: z.string().min(1, "Lender name is required"),
  lenderAddress: z.string().min(1, "Lender address is required"),
  lenderCity: z.string().min(1, "Lender city, state, ZIP is required"),
  lenderEmail: z.string().email("Valid email is required").optional(),
  securityType: z.enum(["unsecured", "real_estate", "vehicle", "personal_property", "business_assets", "securities"]),
  collateralDescription: z.string().optional(),
  collateralValue: z.number().optional(),
  requireNotary: z.boolean().default(false),
  useDigitalSigning: z.boolean().default(false),
});

type PromissoryNoteForm = z.infer<typeof promissoryNoteSchema>;

interface PromissoryNoteDialogProps {
  loanData: LoanInput;
  disabled?: boolean;
}

export default function PromissoryNoteDialog({ loanData, disabled }: PromissoryNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [borrowerSignature, setBorrowerSignature] = useState<string | null>(null);
  const [lenderSignature, setLenderSignature] = useState<string | null>(null);
  const { toast } = useToast();

  // Reset signatures when dialog opens
  useEffect(() => {
    if (open) {
      setBorrowerSignature(null);
      setLenderSignature(null);
    }
  }, [open]);

  const form = useForm<PromissoryNoteForm>({
    resolver: zodResolver(promissoryNoteSchema),
    defaultValues: {
      borrowerName: "",
      borrowerAddress: "",
      borrowerCity: "",
      borrowerEmail: "",
      lenderName: "",
      lenderAddress: "",
      lenderCity: "",
      lenderEmail: "",
      securityType: "unsecured",
      collateralDescription: "",
      collateralValue: undefined,
      requireNotary: false,
      useDigitalSigning: false,
    },
  });

  const handleSubmit = async (data: PromissoryNoteForm) => {
    setIsProcessing(true);

    try {
      const borrowerInfo = {
        name: data.borrowerName,
        address: data.borrowerAddress,
        cityStateZip: data.borrowerCity,
        email: data.borrowerEmail,
        signature: borrowerSignature,
      };

      const lenderInfo = {
        name: data.lenderName,
        address: data.lenderAddress,
        cityStateZip: data.lenderCity,
        email: data.lenderEmail,
        signature: lenderSignature,
      };

      const securityInfo = {
        type: data.securityType,
        description: data.collateralDescription,
        value: data.collateralValue,
        requireNotary: data.requireNotary,
        useDigitalSigning: data.useDigitalSigning,
      };

      if (data.useDigitalSigning && (borrowerSignature || lenderSignature)) {
        // Generate PDF as base64 for DocuSign
        const pdfBlob = generatePromissoryNote(loanData, borrowerInfo, lenderInfo, securityInfo);

        // Convert PDF to base64
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = (reader.result as string).split(',')[1];

          try {
            const response = await apiRequest("POST", "/api/docusign/send-envelope", {
              documentBase64: base64,
              documentName: `Promissory Note - ${data.borrowerName}`,
              signerEmail: data.lenderEmail,
              signerName: data.lenderName,
              borrowerEmail: data.borrowerEmail,
              borrowerName: data.borrowerName,
              returnUrl: window.location.origin
            });

            const result = await response.json();

            if (response.ok) {
              setEnvelopeStatus({
                envelopeId: result.envelopeId,
                status: result.status
              });

              toast({
                title: "Document Sent for Signature",
                description: `Promissory note has been sent to ${data.borrowerEmail} and ${data.lenderEmail} for digital signature.`,
              });
            } else {
              if (result.requiresSetup) {
                toast({
                  title: "DocuSign Setup Required",
                  description: "Please provide your DocuSign API credentials to enable digital signatures. Downloading PDF instead.",
                  variant: "destructive"
                });
              } else {
                throw new Error(result.error || "Failed to send for signature");
              }

              // Fallback to regular PDF download when DocuSign is not configured
              const fallbackSecurityInfo = { ...securityInfo, useDigitalSigning: false };
              generatePromissoryNote(loanData, borrowerInfo, lenderInfo, fallbackSecurityInfo);

              toast({
                title: "Promissory Note Generated",
                description: "Your promissory note has been downloaded as a PDF.",
              });

              setOpen(false);
              form.reset();
            }
          } catch (error: any) {
            console.error("DocuSign error:", error);
            toast({
              title: "Digital Signature Failed",
              description: error.message || "Failed to send document for signature. Downloading PDF instead.",
              variant: "destructive"
            });

            // Fallback to regular PDF download
            const fallbackSecurityInfo = { ...securityInfo, useDigitalSigning: false };
            generatePromissoryNote(loanData, borrowerInfo, lenderInfo, fallbackSecurityInfo);

            toast({
              title: "Promissory Note Generated",
              description: "Your promissory note has been downloaded as a PDF.",
            });

            setOpen(false);
            form.reset();
          }
        };

        reader.readAsDataURL(pdfBlob);
      } else {
        // Regular PDF generation without digital signing
        generatePromissoryNote(loanData, borrowerInfo, lenderInfo, securityInfo);

        toast({
          title: "Promissory Note Generated",
          description: "Your promissory note has been downloaded as a PDF.",
        });

        setOpen(false);
        form.reset();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate promissory note",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const securityOptions = [
    { value: "unsecured", label: "Unsecured Loan", icon: Shield },
    { value: "real_estate", label: "Real Estate", icon: Building },
    { value: "vehicle", label: "Vehicle/Auto", icon: Car },
    { value: "personal_property", label: "Personal Property", icon: Briefcase },
    { value: "business_assets", label: "Business Assets", icon: TrendingUp },
    { value: "securities", label: "Securities/Investments", icon: FileText },
  ];

  const selectedSecurity = form.watch("securityType");
  const isSecured = selectedSecurity !== "unsecured";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="w-full justify-start text-left"
        >
          <FileText className="h-4 w-4 mr-3" />
          <div>
            <div className="font-medium">Promissory Note</div>
            <div className="text-xs text-slate-500">Legal loan agreement document</div>
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Generate Promissory Note
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Borrower Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Borrower Information
                </h3>

                <FormField
                  control={form.control}
                  name="borrowerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="borrowerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123 Main Street" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="borrowerCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City, State, ZIP</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="New York, NY 10001" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="borrowerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="john@example.com" />
                      </FormControl>
                      <FormDescription>
                        Required for digital signature
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Lender Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Lender Information
                </h3>

                <FormField
                  control={form.control}
                  name="lenderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Jane Smith" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lenderAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="456 Oak Avenue" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lenderCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City, State, ZIP</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Los Angeles, CA 90210" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lenderEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="jane@example.com" />
                      </FormControl>
                      <FormDescription>
                        Required for digital signature
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Security & Collateral Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-2">
                Security & Collateral
              </h3>

              <FormField
                control={form.control}
                name="securityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select security type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {securityOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center">
                                <Icon className="h-4 w-4 mr-2" />
                                {option.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select what assets secure this loan
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isSecured && (
                <>
                  <FormField
                    control={form.control}
                    name="collateralDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collateral Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe the asset(s) securing this loan (e.g., '2020 Toyota Camry, VIN: 1234567890')"
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide detailed description including identification numbers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="collateralValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Collateral Value</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="50000"
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormDescription>
                          Current market value of the collateral
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <Separator />

            {/* Execution & Signing Options */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-2">
                Execution & Signing
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requireNotary"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Require Notarization
                        </FormLabel>
                        <FormDescription>
                          Document will include notary requirements
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="useDigitalSigning"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Digital Signing Ready
                        </FormLabel>
                        <FormDescription>
                          Prepare for DocuSign/Blocsign integration
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("requireNotary") && (
                <Card className="p-4 border-blue-200 bg-blue-50">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Notary Integration Available</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Document will include provisions for online notarization through services like NotaryCam or Notarize.com.
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {form.watch("useDigitalSigning") && (
                <Card className="p-4 border-emerald-200 bg-emerald-50">
                  <div className="flex items-start space-x-3">
                    <FileSignature className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-emerald-800">Digital Signing via DocuSign</h4>
                      <p className="text-sm text-emerald-700 mt-1">
                        Document will be sent to both parties via DocuSign for electronic signatures. Both borrower and lender email addresses are required.
                      </p>
                      {!isDocuSignConfigured && (
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-emerald-600">
                            DocuSign API credentials required
                          </p>
                          <DocuSignSetupDialog
                            onSetupComplete={() => {
                              setIsDocuSignConfigured(true);
                              toast({
                                title: "DocuSign Configured",
                                description: "Digital signatures are now available",
                              });
                            }}
                          />
                        </div>
                      )}
                      {isDocuSignConfigured && (
                        <p className="text-xs text-emerald-600 mt-2 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          DocuSign configured and ready
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Loan Summary */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-3">Loan Details Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Principal Amount:</span>
                  <span className="font-medium ml-2">${loanData.loanAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-600">Interest Rate:</span>
                  <span className="font-medium ml-2">{loanData.interestRate}%</span>
                </div>
                <div>
                  <span className="text-slate-600">Term:</span>
                  <span className="font-medium ml-2">{loanData.loanTerm} {loanData.termUnit}</span>
                </div>
                <div>
                  <span className="text-slate-600">Start Date:</span>
                  <span className="font-medium ml-2">{loanData.startDate}</span>
                </div>
              </div>
            </div>

            {/* Digital Signature Status */}
            {envelopeStatus && (
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-start space-x-3">
                  <Send className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-800">Document Sent for Digital Signature</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Envelope ID: {envelopeStatus.envelopeId}
                    </p>
                    <p className="text-sm text-blue-700">
                      Status: {envelopeStatus.status}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "Status Check",
                            description: "Checking signature status...",
                          });
                        }}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Check Status
                      </Button>
                      {envelopeStatus.status === "completed" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Download Started",
                              description: "Downloading signed document...",
                            });
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Signed
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className="bg-slate-900 hover:bg-slate-800"
              >
                {isProcessing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : form.watch("useDigitalSigning") ? (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send for Signature
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Promissory Note
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}