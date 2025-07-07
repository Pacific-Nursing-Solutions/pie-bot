import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PenTool, RotateCcw, Download, FileText } from 'lucide-react';

interface SignatureCaptureProps {
  onSignatureCapture: (signatureData: string) => void;
  disabled?: boolean;
}

export default function SignatureCapture({ onSignatureCapture, disabled }: SignatureCaptureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;
    
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasSignature(true);
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearSignature = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  }, []);

  const saveSignature = useCallback(() => {
    if (!canvasRef.current || !hasSignature) return;
    
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL('image/png');
    onSignatureCapture(signatureData);
    setDialogOpen(false);
    clearSignature(); // Clear for next use
  }, [hasSignature, onSignatureCapture, clearSignature]);

  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 200;

    // Set drawing properties
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fill background with white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  React.useEffect(() => {
    if (dialogOpen) {
      setTimeout(initializeCanvas, 100);
    }
  }, [dialogOpen, initializeCanvas]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          disabled={disabled}
          className="neo-card border-primary/20 hover:border-primary/40 transition-all"
        >
          <PenTool className="mr-2 h-4 w-4" />
          Add Digital Signature
        </Button>
      </DialogTrigger>
      <DialogContent className="neo-card max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Digital Signature
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="border-2 border-dashed border-muted-foreground/20">
            <CardContent className="p-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Draw your signature in the area below
                </p>
                
                <div className="border-2 border-border rounded-lg overflow-hidden bg-white">
                  <canvas
                    ref={canvasRef}
                    className="cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    style={{ display: 'block', width: '100%', height: '100px' }}
                  />
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSignature}
                    className="text-xs"
                  >
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                  
                  <Button
                    onClick={saveSignature}
                    disabled={!hasSignature}
                    size="sm"
                    className="text-xs btn-neo"
                  >
                    <Download className="mr-1 h-3 w-3" />
                    Save Signature
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  By signing, you agree to the terms and conditions of this loan agreement.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}