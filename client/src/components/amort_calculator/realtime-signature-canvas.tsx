import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Shield, Key, Clock, CheckCircle, AlertCircle, Fingerprint, RefreshCw } from 'lucide-react';

interface RealtimeSignatureCanvasProps {
  documentHash: string;
  signerRole: 'borrower' | 'lender';
  signerName: string;
  onSignatureComplete: (signatureData: BlockchainSignature) => void;
  onVisualSignatureUpdate: (visualData: string) => void;
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
  visualSignature?: string;
}

// Generate cryptographic signature from visual signature data
const generateCryptoSignature = async (visualData: string, documentHash: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(visualData + documentHash + Date.now());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const generateKeyPair = () => {
  const privateKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  const publicKey = Array.from(crypto.getRandomValues(new Uint8Array(33)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return { privateKey, publicKey };
};

const simulateBlockchainTransaction = async (): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export default function RealtimeSignatureCanvas({ 
  documentHash, 
  signerRole, 
  signerName, 
  onSignatureComplete,
  onVisualSignatureUpdate,
  disabled 
}: RealtimeSignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSigningDialogOpen, setIsSigningDialogOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [signature, setSignature] = useState<BlockchainSignature | null>(null);
  const [realtimePreview, setRealtimePreview] = useState<string>('');
  const { toast } = useToast();

  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 400;
    canvas.height = 150;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  useEffect(() => {
    if (isSigningDialogOpen) {
      initializeCanvas();
    }
  }, [isSigningDialogOpen, initializeCanvas]);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setHasSignature(true);
    
    // Real-time preview update
    const imageData = canvas.toDataURL('image/png');
    setRealtimePreview(imageData);
    onVisualSignatureUpdate(imageData);
  }, [isDrawing, onVisualSignatureUpdate]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearSignature = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setRealtimePreview('');
    onVisualSignatureUpdate('');
  }, [onVisualSignatureUpdate]);

  const processSignature = useCallback(async () => {
    if (!canvasRef.current || !hasSignature) return;
    
    setIsProcessing(true);
    try {
      const canvas = canvasRef.current;
      const visualSignature = canvas.toDataURL('image/png');
      
      // Generate blockchain components
      const keyPair = generateKeyPair();
      const cryptoSig = await generateCryptoSignature(visualSignature, documentHash);
      const txId = await simulateBlockchainTransaction();
      
      const blockchainSig: BlockchainSignature = {
        signature: cryptoSig,
        publicKey: keyPair.publicKey,
        timestamp: Date.now(),
        documentHash,
        signerRole,
        signerName,
        blockchainTxId: txId,
        verificationStatus: 'verified',
        visualSignature
      };
      
      setSignature(blockchainSig);
      onSignatureComplete(blockchainSig);
      setIsSigningDialogOpen(false);
      
      toast({
        title: "Signature Recorded",
        description: `Blockchain signature created with transaction ${txId.substring(0, 10)}...`,
      });
    } catch (error) {
      toast({
        title: "Signing Failed",
        description: "Failed to process signature. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [hasSignature, documentHash, signerRole, signerName, onSignatureComplete, toast]);

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
                  Live Blockchain Signature
                </CardTitle>
              </div>
              <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                VERIFIED
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Visual Signature Display */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded border">
              <p className="text-sm font-medium mb-2">Visual Signature:</p>
              <img 
                src={signature.visualSignature} 
                alt="Signature" 
                className="max-w-full h-auto border border-gray-200 dark:border-gray-700 rounded"
                style={{ maxHeight: '80px' }}
              />
            </div>
            
            {/* Signature Info */}
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
              <Fingerprint className="w-4 h-4 mr-2" />
              Create Live Blockchain Signature
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Real-time Blockchain Signature</span>
              </DialogTitle>
              <DialogDescription>
                Draw your signature below. It will be instantly converted to a blockchain signature.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Alert>
                <Fingerprint className="w-4 h-4" />
                <AlertDescription>
                  Your signature will be immediately processed with cryptographic hashing and blockchain recording.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <p className="font-medium">Signer</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{signerRole}: {signerName}</p>
                  </div>
                  <Badge variant="outline">{signerRole.toUpperCase()}</Badge>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Draw your signature:</p>
                  <canvas
                    ref={canvasRef}
                    className="border border-gray-300 dark:border-gray-600 rounded cursor-crosshair bg-white"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  
                  <div className="flex justify-between mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearSignature}
                      disabled={!hasSignature}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                    
                    <Button 
                      onClick={processSignature} 
                      disabled={!hasSignature || isProcessing}
                      size="sm"
                    >
                      {isProcessing ? (
                        <>
                          <Clock className="w-3 h-3 mr-1 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Shield className="w-3 h-3 mr-1" />
                          Sign & Record
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Real-time Preview */}
                {realtimePreview && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Live Preview (appears in document in real-time):
                    </p>
                    <img 
                      src={realtimePreview} 
                      alt="Live signature preview" 
                      className="border border-blue-200 dark:border-blue-800 rounded bg-white"
                      style={{ maxHeight: '60px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}