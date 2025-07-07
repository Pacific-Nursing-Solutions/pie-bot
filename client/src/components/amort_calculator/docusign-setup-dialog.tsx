import { useState } from "react";
import { Settings, Key, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const docuSignSetupSchema = z.object({
  integrationKey: z.string().min(1, "Integration Key is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
  userId: z.string().min(1, "User ID is required"),
  accountId: z.string().min(1, "Account ID is required"),
});

type DocuSignSetupForm = z.infer<typeof docuSignSetupSchema>;

interface DocuSignSetupDialogProps {
  onSetupComplete?: () => void;
}

export default function DocuSignSetupDialog({ onSetupComplete }: DocuSignSetupDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    accountName?: string;
  } | null>(null);
  const { toast } = useToast();

  const form = useForm<DocuSignSetupForm>({
    resolver: zodResolver(docuSignSetupSchema),
    defaultValues: {
      integrationKey: "",
      clientSecret: "",
      userId: "",
      accountId: "",
    },
  });

  const handleTestCredentials = async () => {
    const formData = form.getValues();
    
    if (!formData.integrationKey || !formData.clientSecret || !formData.userId || !formData.accountId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before testing",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await apiRequest("POST", "/api/docusign/test-credentials", {
        integrationKey: formData.integrationKey,
        clientSecret: formData.clientSecret,
        userId: formData.userId,
        accountId: formData.accountId,
      });

      const result = await response.json();

      if (response.ok) {
        setTestResult({
          success: true,
          message: "Credentials verified successfully",
          accountName: result.accountName
        });
        toast({
          title: "Credentials Valid",
          description: `Connected to DocuSign account: ${result.accountName}`,
        });
      } else {
        setTestResult({
          success: false,
          message: result.details || result.error || "Credential verification failed"
        });
        toast({
          title: "Invalid Credentials",
          description: result.details || "Please check your credentials and try again",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.message || "Network error during verification"
      });
      toast({
        title: "Connection Error",
        description: "Unable to verify credentials. Check your internet connection.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (data: DocuSignSetupForm) => {
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest("POST", "/api/docusign/configure", {
        integrationKey: data.integrationKey,
        clientSecret: data.clientSecret,
        userId: data.userId,
        accountId: data.accountId,
      });

      if (response.ok) {
        toast({
          title: "DocuSign Configured Successfully",
          description: "Digital signature functionality is now enabled.",
        });
        
        setOpen(false);
        form.reset();
        setTestResult(null);
        onSetupComplete?.();
      } else {
        const result = await response.json();
        throw new Error(result.error || "Failed to configure DocuSign");
      }
    } catch (error: any) {
      toast({
        title: "Configuration Failed",
        description: error.message || "Failed to configure DocuSign credentials",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configure DocuSign
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Configure DocuSign API Credentials
          </DialogTitle>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You'll need a DocuSign developer account to get these credentials. 
            <a 
              href="https://developers.docusign.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              Create one here <ExternalLink className="h-3 w-3 inline" />
            </a>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step-by-Step Setup Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                <div className="flex-1">
                  <p className="font-medium">Create Developer Account</p>
                  <p className="text-gray-600">Go to <a href="https://developers.docusign.com/" target="_blank" className="text-blue-600 underline">developers.docusign.com</a> and sign up for a free developer account</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                <div className="flex-1">
                  <p className="font-medium">Create New App</p>
                  <p className="text-gray-600">In the developer console, click "Create App" and choose "Authorization Code Grant"</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                <div className="flex-1">
                  <p className="font-medium">Configure App Settings</p>
                  <p className="text-gray-600">Set redirect URI to: <code className="bg-gray-100 px-1 rounded">http://localhost:5000/oauth/callback</code></p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</div>
                <div className="flex-1">
                  <p className="font-medium">Get Integration Key & Secret</p>
                  <p className="text-gray-600">Copy the Integration Key (Client ID) and generate + copy the Client Secret</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">5</div>
                <div className="flex-1">
                  <p className="font-medium">Find Your User ID</p>
                  <p className="text-gray-600">Go to <a href="https://appdemo.docusign.com/send/documents/details/" target="_blank" className="text-blue-600 underline">My Profile</a> and copy your User GUID</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">6</div>
                <div className="flex-1">
                  <p className="font-medium">Get Account ID</p>
                  <p className="text-gray-600">In DocuSign admin, go to Settings → API and Integration → Account API to find your Account GUID</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
              <p className="text-sm font-medium text-yellow-800">Important Notes:</p>
              <ul className="list-disc list-inside text-xs text-yellow-700 mt-1 space-y-1">
                <li>Use the Demo/Sandbox environment for testing</li>
                <li>Your app must have "Signature" scope enabled</li>
                <li>User consent may be required on first use</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="integrationKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Integration Key (Client ID)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., 12345678-1234-1234-1234-123456789012" />
                  </FormControl>
                  <FormDescription>
                    Found in your DocuSign app settings as "Integration Key"
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Secret</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Enter your client secret" />
                  </FormControl>
                  <FormDescription>
                    Generated secret key from your DocuSign app
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID (GUID)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., 12345678-1234-1234-1234-123456789012" />
                  </FormControl>
                  <FormDescription>
                    Your DocuSign user GUID from account settings
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account ID (GUID)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., 12345678-1234-1234-1234-123456789012" />
                  </FormControl>
                  <FormDescription>
                    Your DocuSign account GUID from account settings
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Test Results */}
            {testResult && (
              <Card className={`p-4 ${testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-start space-x-3">
                  {testResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                      {testResult.success ? 'Credentials Valid' : 'Validation Failed'}
                    </h4>
                    <p className={`text-sm mt-1 ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                      {testResult.message}
                    </p>
                    {testResult.accountName && (
                      <p className="text-sm text-green-600 mt-1">
                        Account: {testResult.accountName}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleTestCredentials}
                disabled={isTesting || isSubmitting}
              >
                {isTesting ? "Testing..." : "Test Credentials"}
              </Button>
              
              <div className="flex space-x-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !testResult?.success}
                  className={testResult?.success ? "" : "opacity-50"}
                >
                  {isSubmitting ? "Configuring..." : "Save Configuration"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}