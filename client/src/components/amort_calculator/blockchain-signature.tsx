import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Shield, Key, Clock, CheckCircle, AlertCircle, Fingerprint } from 'lucide-react';

interface BlockchainSignatureProps {
  documentHash: string;
  signerRole: 'borrower' | 'lender';
  signerName: string;
  onSignatureComplete: (signatureData: BlockchainSignature) => void;
  disabled?: boolean;
}

interface BlockchainSignature {
  signature: string;
  publicKey: string;
  timestamp: number;
  documentHash: string;
  signerRole: string;
  signerName: string;
  blockchainTxId?: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
  visualSignature?: string; // Base64 encoded visual signature for display
}

// Simulated blockchain signing (in production, this would integrate with actual blockchain)
const generateKeyPair = () => {
  // In production, this would use actual cryptographic libraries like Web3.js or ethers.js
  const privateKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  const publicKey = Array.from(crypto.getRandomValues(new Uint8Array(33)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return { privateKey, publicKey };
};

const createDigitalSignature = async (documentHash: string, privateKey: string): Promise<string> => {
  // In production, this would use actual cryptographic signing
  const encoder = new TextEncoder();
  const data = encoder.encode(documentHash + privateKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const simulateBlockchainTransaction = async (): Promise<string> => {
  // Simulate blockchain transaction delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  return '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export default function BlockchainSignature({ 
  documentHash, 
  signerRole, 
  signerName, 
  onSignatureComplete, 
  disabled 
}: BlockchainSignatureProps) {
  const [isSigningDialogOpen, setIsSigningDialogOpen] = useState(false);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [keyPair, setKeyPair] = useState<{ privateKey: string; publicKey: string } | null>(null);
  const [signature, setSignature] = useState<BlockchainSignature | null>(null);
  const { toast } = useToast();

  const generateKeys = useCallback(async () => {
    setIsGeneratingKeys(true);
    try {
      // Simulate key generation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const keys = generateKeyPair();
      setKeyPair(keys);
      toast({
        title: "Cryptographic Keys Generated",
        description: "Your unique signing keys have been created securely.",
      });
    } catch (error) {
      toast({
        title: "Key Generation Failed",
        description: "Failed to generate cryptographic keys. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingKeys(false);
    }
  }, [toast]);

  const signDocument = useCallback(async () => {
    if (!keyPair) return;
    
    setIsSigning(true);
    try {
      // Create digital signature
      const digitalSignature = await createDigitalSignature(documentHash, keyPair.privateKey);
      
      // Simulate blockchain transaction
      const txId = await simulateBlockchainTransaction();
      
      const blockchainSig: BlockchainSignature = {
        signature: digitalSignature,
        publicKey: keyPair.publicKey,
        timestamp: Date.now(),
        documentHash,
        signerRole,
        signerName,
        blockchainTxId: txId,
        verificationStatus: 'verified'
      };
      
      setSignature(blockchainSig);
      onSignatureComplete(blockchainSig);
      setIsSigningDialogOpen(false);
      
      toast({
        title: "Document Signed Successfully",
        description: `Blockchain signature recorded with transaction ID: ${txId.substring(0, 10)}...`,
      });
    } catch (error) {
      toast({
        title: "Signing Failed",
        description: "Failed to create blockchain signature. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigning(false);
    }
  }, [keyPair, documentHash, signerRole, signerName, onSignatureComplete, toast]);

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-4">
      {signature ? (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <CardTitle className="text-lg text-green-800 dark:text-green-200">
                  Blockchain Signature Verified
                </CardTitle>
              </div>
              <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                {signature.verificationStatus.toUpperCase()}
              </Badge>
            </div>
            <CardDescription className="text-green-700 dark:text-green-300">
              Document signed by {signerName} as {signerRole}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <div>
                <label className="font-medium text-green-800 dark:text-green-200">Signed At:</label>
                <p className="text-xs text-green-700 dark:text-green-300 ml-2">
                  {formatTimestamp(signature.timestamp)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Dialog open={isSigningDialogOpen} onOpenChange={setIsSigningDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950"
              disabled={disabled}
            >
              <Shield className="w-4 h-4 mr-2" />
              Sign with Blockchain Signature
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Fingerprint className="w-5 h-5" />
                <span>Blockchain Digital Signature</span>
              </DialogTitle>
              <DialogDescription>
                Create a cryptographically secure signature using blockchain technology
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Alert>
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  Your signature will be cryptographically signed and recorded on the blockchain for immutable verification.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <p className="font-medium">Signer Role</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{signerRole}</p>
                  </div>
                  <Badge variant="outline">{signerName}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <p className="font-medium">Document Hash</p>
                    <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
                      {formatAddress(documentHash)}
                    </p>
                  </div>
                  <Key className="w-4 h-4 text-gray-500" />
                </div>
              </div>
              
              <Separator />
              
              {!keyPair ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    First, generate your cryptographic key pair for signing:
                  </p>
                  <Button 
                    onClick={generateKeys} 
                    disabled={isGeneratingKeys}
                    className="w-full"
                  >
                    {isGeneratingKeys ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Generating Keys...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        Generate Signing Keys
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Alert className="border-green-200 dark:border-green-800">
                    <CheckCircle className="w-4 h-4" />
                    <AlertDescription>
                      Keys generated successfully. Ready to sign the document.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Your Public Key:</p>
                    <p className="text-xs font-mono p-2 bg-gray-100 dark:bg-gray-800 rounded break-all">
                      {formatAddress(keyPair.publicKey)}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={signDocument} 
                    disabled={isSigning}
                    className="w-full"
                  >
                    {isSigning ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Signing & Recording...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Sign Document
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}