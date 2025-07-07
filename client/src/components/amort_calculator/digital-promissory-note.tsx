import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, User, Building, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePromissoryNote } from "@/lib/amort_calculator/export";
import RealtimeSignatureCanvas from "./realtime-signature-canvas";
import type { LoanInput } from "@shared/schema";

const noteSchema = z.object({
  borrowerName: z.string().min(1, "Borrower name is required"),
  borrowerAddress: z.string().min(1, "Borrower address is required"),
  borrowerCity: z.string().min(1, "City, state, ZIP is required"),
  borrowerContact: z.string().optional(),
  lenderName: z.string().min(1, "Lender name is required"),
  lenderAddress: z.string().min(1, "Lender address is required"),
  lenderCity: z.string().min(1, "City, state, ZIP is required"),
  lenderContact: z.string().optional(),
  amountInWords: z.string().optional(),
  installmentFrequency: z.string().optional(),
  paymentMethod: z.string().optional(),
  gracePeriod: z.string().optional(),
  lateFee: z.string().optional(),
  defaultRate: z.string().optional(),
  // Legacy field for backward compatibility
  collateralDescription: z.string().optional(),
  // New structured collateral fields
  collateralType: z.enum(["unsecured", "real_estate", "vehicle", "personal_property", "other"]).optional(),
  // Real Estate fields
  propertyAddress: z.string().optional(),
  legalDescription: z.string().optional(),
  propertyType: z.enum(["residential", "commercial", "land", "other"]).optional(),
  apn: z.string().optional(),
  // Vehicle fields
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleYear: z.string().optional(),
  vin: z.string().optional(),
  plateNumber: z.string().optional(),
  // Personal Property fields
  personalPropertyDescription: z.string().optional(),
  estimatedValue: z.number().optional(),
  // Other/Custom
  customDescription: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z.string().optional(),
  additionalTerms: z.string().optional(),
});

type NoteForm = z.infer<typeof noteSchema>;

interface DigitalPromissoryNoteProps {
  loanData: LoanInput;
  schedule?: any[];
  disabled?: boolean;
}

export default function DigitalPromissoryNote({ loanData, schedule, disabled }: DigitalPromissoryNoteProps) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [borrowerSignature, setBorrowerSignature] = useState<any | null>(null);
  const [lenderSignature, setLenderSignature] = useState<any | null>(null);
  const [documentHash, setDocumentHash] = useState<string>("");
  const [borrowerVisualPreview, setBorrowerVisualPreview] = useState<string>("");
  const [lenderVisualPreview, setLenderVisualPreview] = useState<string>("");
  const { toast } = useToast();

  // Calculate payment details
  const calculatePaymentDetails = () => {
    const principal = loanData.loanAmount;
    const annualRate = loanData.interestRate / 100;
    const monthlyRate = annualRate / 12;
    const termMonths = loanData.termUnit === 'years' ? loanData.loanTerm * 12 : loanData.loanTerm;

    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
    } else {
      monthlyPayment = principal / termMonths;
    }

    const startDate = new Date(loanData.startDate);
    const firstPaymentDate = new Date(startDate);
    firstPaymentDate.setMonth(firstPaymentDate.getMonth() + 1);

    const finalPaymentDate = new Date(firstPaymentDate);
    finalPaymentDate.setMonth(finalPaymentDate.getMonth() + termMonths - 1);

    return {
      monthlyPayment,
      firstPaymentDate: firstPaymentDate.toLocaleDateString(),
      finalPaymentDate: finalPaymentDate.toLocaleDateString()
    };
  };

  const paymentDetails = calculatePaymentDetails();

  // Generate document hash when loan data changes
  useEffect(() => {
    const generateDocumentHash = async () => {
      const documentString = JSON.stringify({
        loanAmount: loanData.loanAmount,
        interestRate: loanData.interestRate,
        termMonths: loanData.termUnit === 'years' ? loanData.loanTerm * 12 : loanData.loanTerm,
        startDate: loanData.startDate,
        timestamp: Date.now()
      });

      const encoder = new TextEncoder();
      const data = encoder.encode(documentString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setDocumentHash(hashHex);
    };

    generateDocumentHash();
  }, [loanData]);

  const form = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      borrowerName: "",
      borrowerAddress: "",
      borrowerCity: "",
      borrowerContact: "",
      lenderName: "",
      lenderAddress: "",
      lenderCity: "",
      lenderContact: "",
      amountInWords: "",
      installmentFrequency: "Monthly",
      paymentMethod: "",
      gracePeriod: "10 calendar days",
      lateFee: "$50.00",
      defaultRate: "15%",
      collateralDescription: "",
      // New structured collateral fields
      collateralType: "unsecured",
      // Real Estate fields
      propertyAddress: "",
      legalDescription: "",
      propertyType: undefined,
      apn: "",
      // Vehicle fields
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
      vin: "",
      plateNumber: "",
      // Personal Property fields
      personalPropertyDescription: "",
      estimatedValue: undefined,
      // Other/Custom
      customDescription: "",
      jurisdiction: "",
      disputeResolution: "",
      additionalTerms: "",
    },
  });

  const handleSubmit = async (data: NoteForm) => {
    if (!borrowerSignature && !lenderSignature) {
      toast({
        title: "Signatures Required",
        description: "Please add at least one signature before generating the document.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Generate collateral description from structured fields
      const generateCollateralDescription = () => {
        if (data.collateralType === "unsecured") {
          return "This loan is UNSECURED and not secured by any collateral.";
        }

        if (data.collateralType === "real_estate") {
          let description = `Real Estate Property: `;
          if (data.propertyType) {
            description += `${data.propertyType.charAt(0).toUpperCase() + data.propertyType.slice(1)} property `;
          }
          if (data.propertyAddress) {
            description += `located at ${data.propertyAddress}`;
          }
          if (data.apn) {
            description += `, APN: ${data.apn}`;
          }
          if (data.legalDescription) {
            description += `. Legal Description: ${data.legalDescription}`;
          }
          return description;
        }

        if (data.collateralType === "vehicle") {
          let description = `Motor Vehicle: `;
          if (data.vehicleYear && data.vehicleMake && data.vehicleModel) {
            description += `${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}`;
          }
          if (data.vin) {
            description += `, VIN: ${data.vin}`;
          }
          if (data.plateNumber) {
            description += `, License Plate: ${data.plateNumber}`;
          }
          return description;
        }

        if (data.collateralType === "personal_property") {
          let description = `Personal Property: `;
          if (data.personalPropertyDescription) {
            description += data.personalPropertyDescription;
          }
          if (data.estimatedValue) {
            description += ` (Estimated Value: $${data.estimatedValue.toLocaleString()})`;
          }
          return description;
        }

        if (data.collateralType === "other" && data.customDescription) {
          return data.customDescription;
        }

        return data.collateralDescription || "No collateral specified.";
      };

      const borrowerInfo = {
        name: data.borrowerName,
        address: data.borrowerAddress,
        city: data.borrowerCity,
        borrowerContact: data.borrowerContact,
        amountInWords: data.amountInWords,
        installmentFrequency: data.installmentFrequency,
        paymentMethod: data.paymentMethod,
        gracePeriod: data.gracePeriod,
        lateFee: data.lateFee,
        defaultRate: data.defaultRate,
        collateralDescription: generateCollateralDescription(),
        jurisdiction: data.jurisdiction,
        disputeResolution: data.disputeResolution,
        signature: borrowerSignature,
      };

      const lenderInfo = {
        name: data.lenderName,
        address: data.lenderAddress,
        city: data.lenderCity,
        lenderContact: data.lenderContact,
        signature: lenderSignature,
      };

      const securityInfo = {
        type: data.collateralType || "unsecured",
        additionalTerms: data.additionalTerms,
      };

      // Generate signed promissory note
      const pdfBlob = generatePromissoryNote(loanData, borrowerInfo, lenderInfo, securityInfo, schedule, data.additionalTerms);

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Promissory_Note_${data.borrowerName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Document Generated",
        description: "The signed promissory note has been downloaded successfully.",
      });

      setOpen(false);
      form.reset();
      setBorrowerSignature(null);
      setLenderSignature(null);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate the promissory note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="neo-card border-primary/20 hover:border-primary/40 transition-all"
        >
          <FileText className="mr-2 h-4 w-4" />
          Generate Promissory Note
        </Button>
      </DialogTrigger>
      <DialogContent className="neo-card max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Digital Promissory Note
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Loan Summary */}
            <Card className="neo-card">
              <CardHeader>
                <CardTitle className="text-lg">Loan Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Principal Amount:</span>
                  <p className="font-semibold">${loanData.loanAmount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Interest Rate:</span>
                  <p className="font-semibold">{loanData.interestRate}% per year</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Term:</span>
                  <p className="font-semibold">{loanData.loanTerm} {loanData.termUnit}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Start Date:</span>
                  <p className="font-semibold">{new Date(loanData.startDate).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Borrower Information */}
            <Card className="neo-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Borrower Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="borrowerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="neo-input" />
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
                        <Input {...field} className="neo-input" />
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
                        <Input {...field} className="neo-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="borrowerContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Information (Email or Phone)</FormLabel>
                      <FormControl>
                        <Input {...field} className="neo-input" placeholder="Optional" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <h4 className="font-medium mb-2">Borrower Real-time Signature</h4>
                  <RealtimeSignatureCanvas
                    documentHash={documentHash}
                    signerRole="borrower"
                    signerName={form.watch("borrowerName") || "Borrower"}
                    onSignatureComplete={setBorrowerSignature}
                    onVisualSignatureUpdate={setBorrowerVisualPreview}
                    disabled={!documentHash}
                  />

                  {/* Live Preview */}
                  {borrowerVisualPreview && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                        Live signature preview (will appear in document):
                      </p>
                      <img
                        src={borrowerVisualPreview}
                        alt="Borrower signature preview"
                        className="border border-blue-200 dark:border-blue-800 rounded bg-white"
                        style={{ maxHeight: '60px' }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Lender Information */}
            <Card className="neo-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Lender Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="lenderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name or Organization</FormLabel>
                      <FormControl>
                        <Input {...field} className="neo-input" />
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
                        <Input {...field} className="neo-input" />
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
                        <Input {...field} className="neo-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lenderContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Information (Email or Phone)</FormLabel>
                      <FormControl>
                        <Input {...field} className="neo-input" placeholder="Optional" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <h4 className="font-medium mb-2">Lender Real-time Signature</h4>
                  <RealtimeSignatureCanvas
                    documentHash={documentHash}
                    signerRole="lender"
                    signerName={form.watch("lenderName") || "Lender"}
                    onSignatureComplete={setLenderSignature}
                    onVisualSignatureUpdate={setLenderVisualPreview}
                    disabled={!documentHash}
                  />

                  {/* Live Preview */}
                  {lenderVisualPreview && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                        Live signature preview (will appear in document):
                      </p>
                      <img
                        src={lenderVisualPreview}
                        alt="Lender signature preview"
                        className="border border-green-200 dark:border-green-800 rounded bg-white"
                        style={{ maxHeight: '60px' }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Loan Terms */}
            <Card className="neo-card">
              <CardHeader>
                <CardTitle>Loan Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="amountInWords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount in Words</FormLabel>
                      <FormControl>
                        <Input {...field} className="neo-input" placeholder="e.g., Ten Thousand Dollars" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="installmentFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Installment Frequency</FormLabel>
                        <FormControl>
                          <Input {...field} className="neo-input" placeholder="e.g., Monthly / Quarterly / Annually" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method/Address</FormLabel>
                        <FormControl>
                          <Input {...field} className="neo-input" placeholder="e.g., bank transfer to specified account" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Default Terms */}
            <Card className="neo-card">
              <CardHeader>
                <CardTitle>Default and Late Payment Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="gracePeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grace Period</FormLabel>
                        <FormControl>
                          <Input {...field} className="neo-input" placeholder="e.g., 10 calendar days" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lateFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Late Fee Amount</FormLabel>
                        <FormControl>
                          <Input {...field} className="neo-input" placeholder="e.g., $50.00" />
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
                        <FormLabel>Default Interest Rate</FormLabel>
                        <FormControl>
                          <Input {...field} className="neo-input" placeholder="e.g., 15%" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Legal Terms */}
            <Card className="neo-card">
              <CardHeader>
                <CardTitle>Legal and Security Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="collateralType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="neo-input">
                            <SelectValue placeholder="Select security type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="unsecured">Unsecured Loan</SelectItem>
                          <SelectItem value="real_estate">Real Estate Property</SelectItem>
                          <SelectItem value="vehicle">Motor Vehicle</SelectItem>
                          <SelectItem value="personal_property">Personal Property</SelectItem>
                          <SelectItem value="other">Other Collateral</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Real Estate Fields */}
                {form.watch("collateralType") === "real_estate" && (
                  <div className="space-y-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">Real Estate Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="neo-input">
                                  <SelectValue placeholder="Select property type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="residential">Residential</SelectItem>
                                <SelectItem value="commercial">Commercial</SelectItem>
                                <SelectItem value="land">Land/Vacant Lot</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="apn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assessor's Parcel Number (APN)</FormLabel>
                            <FormControl>
                              <Input {...field} className="neo-input" placeholder="e.g., 123-456-789" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="propertyAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Address</FormLabel>
                          <FormControl>
                            <Input {...field} className="neo-input" placeholder="e.g., 123 Main Street, City, State, ZIP" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="legalDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Legal Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="neo-input min-h-[60px]"
                              placeholder="Legal description from deed or title report"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Vehicle Fields */}
                {form.watch("collateralType") === "vehicle" && (
                  <div className="space-y-4 p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                    <h4 className="font-medium text-green-800 dark:text-green-200">Vehicle Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="vehicleYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <Input {...field} className="neo-input" placeholder="e.g., 2020" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vehicleMake"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Make</FormLabel>
                            <FormControl>
                              <Input {...field} className="neo-input" placeholder="e.g., Toyota" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vehicleModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                              <Input {...field} className="neo-input" placeholder="e.g., Camry" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="vin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>VIN Number</FormLabel>
                            <FormControl>
                              <Input {...field} className="neo-input" placeholder="17-digit VIN number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="plateNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Plate Number</FormLabel>
                            <FormControl>
                              <Input {...field} className="neo-input" placeholder="e.g., ABC1234" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Personal Property Fields */}
                {form.watch("collateralType") === "personal_property" && (
                  <div className="space-y-4 p-4 border rounded-lg bg-purple-50 dark:bg-purple-950">
                    <h4 className="font-medium text-purple-800 dark:text-purple-200">Personal Property Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="personalPropertyDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Description</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="neo-input min-h-[60px]"
                                placeholder="e.g., Electronics, jewelry, equipment, etc."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="estimatedValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimated Value</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="neo-input"
                                placeholder="e.g., $5,000"
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value.replace(/[^\d.-]/g, ''));
                                  field.onChange(isNaN(value) ? undefined : value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Other Collateral Fields */}
                {form.watch("collateralType") === "other" && (
                  <div className="space-y-4 p-4 border rounded-lg bg-orange-50 dark:bg-orange-950">
                    <h4 className="font-medium text-orange-800 dark:text-orange-200">Other Collateral Information</h4>
                    <FormField
                      control={form.control}
                      name="customDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Collateral Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="neo-input min-h-[80px]"
                              placeholder="Detailed description of the collateral securing this loan"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jurisdiction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Governing Jurisdiction</FormLabel>
                        <FormControl>
                          <Input {...field} className="neo-input" placeholder="e.g., State of California, USA" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="disputeResolution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dispute Resolution Method</FormLabel>
                        <FormControl>
                          <Input {...field} className="neo-input" placeholder="e.g., binding arbitration / mediation / litigation" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Terms */}
            <Card className="neo-card">
              <CardHeader>
                <CardTitle>Additional Terms (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="additionalTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Conditions or Additional Terms</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="neo-input min-h-[100px]"
                          placeholder="Enter any additional terms, conditions, or special arrangements..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Live Document Preview */}
            <Card className="neo-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Live Document Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto border rounded-lg p-6 bg-white dark:bg-gray-900 text-sm text-left font-serif leading-relaxed">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold uppercase tracking-wide">PROMISSORY NOTE</h1>
                    <div className="border-b-2 border-gray-800 dark:border-gray-200 mt-2 mb-4"></div>
                  </div>

                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="mb-2"><strong>PRINCIPAL AMOUNT:</strong> {form.watch("amountInWords") ? `${form.watch("amountInWords")} (${loanData.loanAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})` : loanData.loanAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                      <p><strong>DATE:</strong> {new Date().toLocaleDateString()}</p>
                    </div>

                    <div>
                      <h3 className="font-bold mb-3 text-center uppercase">ARTICLE I - PARTIES TO THE AGREEMENT</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border p-3">
                          <p className="font-bold mb-2">BORROWER:</p>
                          <p>{form.watch("borrowerName") || "___________________"}</p>
                          <p>{form.watch("borrowerAddress") || "___________________"}</p>
                          <p>{form.watch("borrowerCity") || "___________________"}</p>
                          {form.watch("borrowerContact") && <p>{form.watch("borrowerContact")}</p>}
                        </div>

                        <div className="border p-3">
                          <p className="font-bold mb-2">LENDER:</p>
                          <p>{form.watch("lenderName") || "___________________"}</p>
                          <p>{form.watch("lenderAddress") || "___________________"}</p>
                          <p>{form.watch("lenderCity") || "___________________"}</p>
                          {form.watch("lenderContact") && <p>{form.watch("lenderContact")}</p>}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-3 text-center uppercase">ARTICLE II - PROMISE TO PAY</h3>
                      <p className="text-justify">FOR VALUE RECEIVED, the undersigned Borrower hereby unconditionally promises to pay to the order of the Lender, the principal sum of <strong>{loanData.loanAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong>, together with interest thereon at the rate of <strong>{loanData.interestRate}% per annum</strong>, calculated on the unpaid principal balance from time to time outstanding.</p>
                    </div>

                    <div>
                      <h3 className="font-bold mb-3 text-center uppercase">ARTICLE III - TERMS OF REPAYMENT</h3>
                      <div className="border p-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <p><strong>Payment Frequency:</strong> {form.watch("installmentFrequency") || "Monthly"}</p>
                          <p><strong>Payment Amount:</strong> ${paymentDetails.monthlyPayment.toFixed(2)}</p>
                          <p><strong>First Payment Due:</strong> {paymentDetails.firstPaymentDate}</p>
                          <p><strong>Final Payment Due:</strong> {paymentDetails.finalPaymentDate}</p>
                          <p><strong>Payment Method:</strong> {form.watch("paymentMethod") || "___________________"}</p>
                          <p><strong>Loan Term:</strong> {loanData.loanTerm} {loanData.termUnit}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-justify">All payments shall be made in lawful currency of the United States. Early repayment is permitted without penalty, with prepayments applied first to accrued interest, then to principal.</p>
                    </div>

                    <div>
                      <h3 className="font-bold mb-3 text-center uppercase">ARTICLE IV - DEFAULT AND REMEDIES</h3>
                      <p className="text-justify">
                        In the event any payment hereunder is not made within <strong>{form.watch("gracePeriod") || "___"} days</strong> of its due date,
                        the unpaid amount shall bear interest at the default rate of <strong>{form.watch("defaultRate") || "___"}% per annum</strong>,
                        compounded {form.watch("installmentFrequency")?.toLowerCase() || "monthly"}. Should payment remain delinquent after the
                        expiration of said grace period, the entire unpaid principal balance, together with all accrued interest, may,
                        at the sole option of the Lender, become immediately due and payable without further notice or demand.
                      </p>
                    </div>

                    {form.watch("collateralType") && form.watch("collateralType") !== "unsecured" && (
                      <div>
                        <h3 className="font-bold mb-3 text-center uppercase">ARTICLE V - SECURITY INTEREST</h3>
                        <p className="text-justify">This Note is secured by the following collateral: <strong>
                          {(() => {
                            const collateralType = form.watch("collateralType");
                            if (collateralType === "real_estate") {
                              let description = `Real Estate Property: `;
                              const propertyType = form.watch("propertyType");
                              const propertyAddress = form.watch("propertyAddress");
                              const apn = form.watch("apn");
                              const legalDescription = form.watch("legalDescription");

                              if (propertyType) {
                                description += `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} property `;
                              }
                              if (propertyAddress) {
                                description += `located at ${propertyAddress}`;
                              }
                              if (apn) {
                                description += `, APN: ${apn}`;
                              }
                              if (legalDescription) {
                                description += `. Legal Description: ${legalDescription}`;
                              }
                              return description;
                            }

                            if (collateralType === "vehicle") {
                              let description = `Motor Vehicle: `;
                              const vehicleYear = form.watch("vehicleYear");
                              const vehicleMake = form.watch("vehicleMake");
                              const vehicleModel = form.watch("vehicleModel");
                              const vin = form.watch("vin");
                              const plateNumber = form.watch("plateNumber");

                              if (vehicleYear && vehicleMake && vehicleModel) {
                                description += `${vehicleYear} ${vehicleMake} ${vehicleModel}`;
                              }
                              if (vin) {
                                description += `, VIN: ${vin}`;
                              }
                              if (plateNumber) {
                                description += `, License Plate: ${plateNumber}`;
                              }
                              return description;
                            }

                            if (collateralType === "personal_property") {
                              let description = `Personal Property: `;
                              const personalPropertyDescription = form.watch("personalPropertyDescription");
                              const estimatedValue = form.watch("estimatedValue");

                              if (personalPropertyDescription) {
                                description += personalPropertyDescription;
                              }
                              if (estimatedValue) {
                                description += ` (Estimated Value: $${estimatedValue.toLocaleString()})`;
                              }
                              return description;
                            }

                            if (collateralType === "other") {
                              return form.watch("customDescription") || "Other collateral as described";
                            }

                            return form.watch("collateralDescription") || "Collateral to be specified";
                          })()}
                        </strong>.
                          In the event of default, Lender may exercise all rights and remedies available at law or in equity with respect to such collateral.</p>
                      </div>
                    )}

                    {form.watch("collateralType") === "unsecured" && (
                      <div>
                        <h3 className="font-bold mb-3 text-center uppercase">ARTICLE V - UNSECURED LOAN</h3>
                        <p className="text-justify">This loan is <strong>UNSECURED</strong> and is not secured by any collateral. The Borrower's obligation to repay is based solely on their personal promise to pay and creditworthiness.</p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold mb-3 text-center uppercase">ARTICLE VI - GENERAL PROVISIONS</h3>
                      <div className="space-y-2 text-justify">
                        {form.watch("jurisdiction") && <p><strong>Governing Law:</strong> This Note shall be governed by the laws of {form.watch("jurisdiction")}.</p>}
                        {form.watch("disputeResolution") && <p><strong>Dispute Resolution:</strong> {form.watch("disputeResolution")}</p>}
                        <p><strong>Waiver:</strong> No failure by Lender to exercise any right shall constitute a waiver of such right.</p>
                        <p><strong>Severability:</strong> If any provision hereof is invalid, the remainder shall remain in full force and effect.</p>
                      </div>
                    </div>

                    {form.watch("additionalTerms") && (
                      <div>
                        <h3 className="font-bold mb-3 text-center uppercase">ARTICLE VII - ADDITIONAL TERMS</h3>
                        <p className="text-justify">{form.watch("additionalTerms")}</p>
                      </div>
                    )}

                    <div className="border-t-2 border-gray-800 dark:border-gray-200 pt-4">
                      <h3 className="font-bold mb-4 text-center uppercase">EXECUTION</h3>
                      <p className="text-center mb-6 font-bold">IN WITNESS WHEREOF, the parties have executed this Promissory Note as of the date first written above.</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="text-center">
                          <div className="mb-4">
                            {borrowerVisualPreview && (
                              <img
                                src={borrowerVisualPreview}
                                alt="Borrower signature"
                                className="border rounded bg-white mx-auto"
                                style={{ maxHeight: '60px', minHeight: '40px', minWidth: '200px' }}
                              />
                            )}
                            {!borrowerVisualPreview && <div className="border-b-2 border-black h-12 w-48 mx-auto"></div>}
                          </div>
                          <p className="font-bold">BORROWER</p>
                          <p>{form.watch("borrowerName") || "___________________"}</p>
                          <p className="text-xs mt-2">Date: ___________</p>
                        </div>

                        <div className="text-center">
                          <div className="mb-4">
                            {lenderVisualPreview && (
                              <img
                                src={lenderVisualPreview}
                                alt="Lender signature"
                                className="border rounded bg-white mx-auto"
                                style={{ maxHeight: '60px', minHeight: '40px', minWidth: '200px' }}
                              />
                            )}
                            {!lenderVisualPreview && <div className="border-b-2 border-black h-12 w-48 mx-auto"></div>}
                          </div>
                          <p className="font-bold">LENDER</p>
                          <p>{form.watch("lenderName") || "___________________"}</p>
                          <p className="text-xs mt-2">Date: ___________</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className="btn-neo"
              >
                {isProcessing ? (
                  "Generating..."
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Signed Document
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