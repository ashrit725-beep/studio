"use client";

import React from "react";
import DocumentUploader from "@/components/dashboard/DocumentUploader";
import VerificationResult from "@/components/dashboard/VerificationResult";
import UsageCharts from "@/components/dashboard/UsageCharts";
import type { DocumentAuthenticityAnalysisOutput } from "@/ai/flows/document-authenticity-analysis";

export default function DashboardPage() {
  const [analysisResult, setAnalysisResult] = React.useState<DocumentAuthenticityAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <div className="grid gap-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <DocumentUploader 
          setAnalysisResult={setAnalysisResult} 
          setIsLoading={setIsLoading} 
          isLoading={isLoading}
        />
        <VerificationResult result={analysisResult} isLoading={isLoading} />
      </div>
      <UsageCharts />
    </div>
  );
}
