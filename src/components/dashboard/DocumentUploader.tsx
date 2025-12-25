"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Upload, X, Loader2, Camera, ScanLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { verifyDocument } from "@/actions/verification";
import { DocumentAuthenticityAnalysisOutput } from "@/ai/flows/document-authenticity-analysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface DocumentUploaderProps {
  setAnalysisResult: (result: DocumentAuthenticityAnalysisOutput) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ setAnalysisResult, setIsLoading, isLoading }) => {
  const [file, setFile] = useState<(File & { preview: string }) | null>(null);
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const getCameraPermission = async () => {
    if (hasCameraPermission === false) return; // Don't re-request if already denied
    if (hasCameraPermission === true) {
        setIsCameraActive(true);
        return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setHasCameraPermission(true);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
      setIsCameraActive(false);
      toast({
        variant: "destructive",
        title: "Camera Access Denied",
        description: "Please enable camera permissions in your browser settings.",
      });
    }
  };

  const stopCamera = () => {
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
      }
      if(videoRef.current){
          videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
  }
  
  useEffect(() => {
    return () => {
        stopCamera();
    }
  }, []);


  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      const selectedFile = acceptedFiles[0];
      setFile(Object.assign(selectedFile, { preview: URL.createObjectURL(selectedFile) }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const analyzeImage = async (base64: string) => {
    setIsLoading(true);
    const response = await verifyDocument(base64);
    if (response.success && response.data) {
      setAnalysisResult(response.data);
      toast({
        title: "Analysis Complete",
        description: `Document identified as ${response.data.documentType}.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: response.error || "An unknown error occurred.",
      });
    }
    setIsLoading(false);
  };
  
  const handleAnalyze = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please upload or capture a document to analyze.",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => analyzeImage(reader.result as string);
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      toast({ variant: "destructive", title: "File Read Error", description: "Could not read the selected file." });
      setIsLoading(false);
    };
  };

  const removeFile = () => {
    if (file) {
      URL.revokeObjectURL(file.preview);
    }
    setFile(null);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        canvas.toBlob(blob => {
          if (blob) {
            const capturedFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
            const previewUrl = URL.createObjectURL(capturedFile);
            setFile(Object.assign(capturedFile, { preview: previewUrl }));
          }
        }, 'image/jpeg');
        stopCamera();
        analyzeImage(dataUrl);
      }
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Verify Document</CardTitle>
        <CardDescription>Upload or capture a government-issued ID to check its authenticity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="upload" onValueChange={(value) => value === 'upload' && stopCamera()}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="mr-2 h-4 w-4" /> Upload File
            </TabsTrigger>
            <TabsTrigger value="camera" onClick={getCameraPermission}>
              <Camera className="mr-2 h-4 w-4" /> Use Camera
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <div
              {...getRootProps()}
              className={`flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed
              ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                <p>{isDragActive ? "Drop the file here" : "Drag & drop or click to upload"}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="camera">
            <div className="relative flex flex-col items-center justify-center space-y-2">
              {hasCameraPermission === false && (
                 <Alert variant="destructive">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                      Please allow camera access to use this feature. You may need to grant permission in your browser's settings.
                    </AlertDescription>
                </Alert>
              )}
               <div className="relative w-full aspect-video rounded-md bg-muted overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                {isCameraActive && <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <ScanLine className="h-2/3 w-2/3 text-white/30 animate-pulse" />
                </div>}
              </div>

              <canvas ref={canvasRef} className="hidden" />
              <Button onClick={captureImage} disabled={!isCameraActive || isLoading} size="lg" className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-5 w-5" />}
                {isLoading ? "Analyzing..." : "Capture & Analyze"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {file && !isCameraActive && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-2">
              <div className="flex items-center gap-2 overflow-hidden">
                  <Image src={file.preview} alt="Preview" width={40} height={30} className="rounded-md object-cover h-10 w-12"/>
                  <p className="truncate text-sm font-medium">{file.name}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Analyzing..." : "Analyze Uploaded Document"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
