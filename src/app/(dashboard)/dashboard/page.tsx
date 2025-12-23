"use client";

import React from "react";
import DocumentUploader from "@/components/dashboard/DocumentUploader";
import VerificationResult from "@/components/dashboard/VerificationResult";
import UsageCharts from "@/components/dashboard/UsageCharts";
import VerificationStats from "@/components/dashboard/VerificationStats";
import type { DocumentAuthenticityAnalysisOutput } from "@/ai/flows/document-authenticity-analysis";

export default function DashboardPage() {
  const [analysisResult, setAnalysisResult] = React.useState<DocumentAuthenticityAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [recentVerifications, setRecentVerifications] = React.useState<DocumentAuthenticityAnalysisOutput[]>([]);

  const handleAnalysisComplete = (result: DocumentAuthenticityAnalysisOutput) => {
    setAnalysisResult(result);
    setRecentVerifications(prev => [result, ...prev].slice(0, 5));
  };

  return (
    <div className="grid gap-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <DocumentUploader 
          setAnalysisResult={handleAnalysisComplete}
          setIsLoading={setIsLoading} 
          isLoading={isLoading}
        />
        <VerificationResult result={analysisResult} isLoading={isLoading} />
      </div>
      <VerificationStats recentVerifications={recentVerifications} />
      <UsageCharts />
    </div>
  );
}
