"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { verifyDocument } from "@/actions/verification";
import { DocumentAuthenticityAnalysisOutput } from "@/ai/flows/document-authenticity-analysis";

interface DocumentUploaderProps {
  setAnalysisResult: (result: DocumentAuthenticityAnalysisOutput | null) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ setAnalysisResult, setIsLoading, isLoading }) => {
  const [file, setFile] = useState<(File & { preview: string }) | null>(null);
  const { toast } = useToast();

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
        description: "Please upload a document to analyze.",
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
        console.error('Error reading file:', error);
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the selected file.',
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Document</CardTitle>
        <CardDescription>Upload a government-issued ID to check its authenticity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed
          ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="relative h-full w-full">
              <Image src={file.preview} alt="Preview" fill className="object-contain rounded-lg p-2" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Upload className="h-8 w-8" />
              <p>{isDragActive ? "Drop the file here" : "Drag & drop or click to upload"}</p>
            </div>
          )}
        </div>
        {file && (
          <div className="flex items-center justify-between rounded-lg border p-2">
            <p className="truncate text-sm">{file.name}</p>
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
