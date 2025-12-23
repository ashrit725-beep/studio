"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Upload, X, Loader2, Camera, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { verifyDocument } from "@/actions/verification";
import { DocumentAuthenticityAnalysisOutput } from "@/ai/flows/document-authenticity-analysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface DocumentUploaderProps {
  setAnalysisResult: (result: DocumentAuthenticityAnalysisOutput | null) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ setAnalysisResult, setIsLoading, isLoading }) => {
  const [file, setFile] = useState<(File & { preview: string }) | null>(null);
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getCameraPermission = async () => {
    if (hasCameraPermission !== null) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
      toast({
        variant: "destructive",
        title: "Camera Access Denied",
        description: "Please enable camera permissions in your browser settings.",
      });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      const selectedFile = acceptedFiles[0];
      setFile(Object.assign(selectedFile, { preview: URL.createObjectURL(selectedFile) }));
      setAnalysisResult(null);
    }
  }, [setAnalysisResult]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please upload or capture a document to analyze.",
      });
      return;
    }
    setIsLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result as string;
      const response = await verifyDocument(base64);
      if (response.success && response.data) {
        setAnalysisResult(response.data);
        toast({
          title: "Analysis Complete",
          description: "The document has been successfully analyzed.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: response.error || "An unknown error occurred.",
        });
        setAnalysisResult(null);
      }
      setIsLoading(false);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      toast({
        variant: "destructive",
        title: "File Read Error",
        description: "Could not read the selected file.",
      });
      setIsLoading(false);
    };
  };

  const removeFile = () => {
    if (file) {
      URL.revokeObjectURL(file.preview);
    }
    setFile(null);
    setAnalysisResult(null);
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
        canvas.toBlob(blob => {
          if (blob) {
            const capturedFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
            setFile(Object.assign(capturedFile, { preview: URL.createObjectURL(capturedFile) }));
            setAnalysisResult(null);
          }
        }, 'image/jpeg');
      }
    }
  };

  useEffect(() => {
    return () => {
        // Cleanup function to stop video stream when component unmounts
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Document</CardTitle>
        <CardDescription>Upload or capture a government-issued ID to check its authenticity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="upload">
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
              <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
              <canvas ref={canvasRef} className="hidden" />
              <Button onClick={captureImage} disabled={!hasCameraPermission || isLoading} size="icon" className="h-16 w-16 rounded-full absolute bottom-4">
                <Circle className="h-12 w-12 text-white fill-white" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {file && (
          <div className="flex items-center justify-between rounded-lg border p-2">
            <div className="flex items-center gap-2">
                <Image src={file.preview} alt="Preview" width={40} height={30} className="rounded-md object-cover"/>
                <p className="truncate text-sm">{file.name}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Button onClick={handleAnalyze} disabled={!file || isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Analyzing..." : "Analyze Document"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
