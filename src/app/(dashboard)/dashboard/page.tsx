"use client";

import React from "react";
import { collection } from "firebase/firestore";
import DocumentUploader from "@/components/dashboard/DocumentUploader";
import VerificationResult from "@/components/dashboard/VerificationResult";
import UsageCharts from "@/components/dashboard/UsageCharts";
import VerificationStats from "@/components/dashboard/VerificationStats";
import type { DocumentAuthenticityAnalysisOutput } from "@/ai/flows/document-authenticity-analysis";
import { useUser, useFirestore, addDocumentNonBlocking, useCollection, useMemoFirebase } from "@/firebase";
import { VerificationRequest } from "@/types";

export default function DashboardPage() {
  const [analysisResult, setAnalysisResult] = React.useState<DocumentAuthenticityAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { user } = useUser();
  const firestore = useFirestore();

  const userVerificationsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/verificationRequests`);
  }, [firestore, user]);
  
  const { data: recentVerifications } = useCollection<VerificationRequest>(userVerificationsQuery);


  const handleAnalysisComplete = (result: DocumentAuthenticityAnalysisOutput) => {
    setAnalysisResult(result);
    if (user && userVerificationsQuery) {
        const newVerification: Omit<VerificationRequest, 'id'> = {
            userId: user.uid,
            documentType: result.documentType,
            uploadTimestamp: new Date().toISOString(),
            verificationStatus: result.authenticity.isReal ? 'Verified' : 'Failed',
            authenticityScore: result.authenticity.confidenceScore,
            isReal: result.authenticity.isReal,
            documentAiResponse: result.authenticity.analysisDetails,
        }
        addDocumentNonBlocking(userVerificationsQuery, newVerification);
    }
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
      <UsageCharts verificationData={recentVerifications || []}/>
      <VerificationStats recentVerifications={recentVerifications || []} />
    </div>
  );
}
