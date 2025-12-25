import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, FileQuestion } from "lucide-react";
import type { DocumentAuthenticityAnalysisOutput } from "@/ai/flows/document-authenticity-analysis";
import { cn } from "@/lib/utils";

interface VerificationResultProps {
  result: DocumentAuthenticityAnalysisOutput | null;
  isLoading: boolean;
}

const VerificationResult: React.FC<VerificationResultProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="flex flex-col items-center justify-center text-center">
        <CardHeader>
          <CardTitle>Analysis Result</CardTitle>
          <CardDescription>Results will be displayed here after analysis.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center">
          <FileQuestion className="h-16 w-16 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Upload or capture a document to begin</p>
        </CardContent>
      </Card>
    );
  }

  const { documentType, authenticity } = result;
  const confidencePercent = Math.round(authenticity.confidenceScore);
  const isReal = authenticity.isReal;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Result</CardTitle>
        <CardDescription>Detailed breakdown of the document verification.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-3 rounded-lg border p-4">
            <div className="space-y-1 text-center">
                <h3 className="text-lg font-semibold">Document Type</h3>
                <p className="text-muted-foreground">{documentType}</p>
            </div>
            <div className="space-y-1 text-center">
                <h3 className="text-lg font-semibold">Overall Authenticity</h3>
                <Badge variant={isReal ? "success" : "destructive"} className="text-base">
                    {isReal ? (
                    <CheckCircle className="mr-2 h-4 w-4" />
                    ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                    )}
                    {isReal ? "Likely Authentic" : "Potentially Altered"}
                </Badge>
            </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between font-medium">
            <span>Confidence Score</span>
            <span>{confidencePercent}%</span>
          </div>
          <Progress value={confidencePercent} className={cn(isReal ? "[&>div]:bg-green-500" : "[&>div]:bg-destructive")} />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Analysis Details</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{authenticity.analysisDetails}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationResult;
