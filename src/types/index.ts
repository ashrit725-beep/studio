export type UserProfile = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    registrationDate: string;
};

export type VerificationHistoryItem = {
  id: string;
  documentType: string;
  date: string;
  status: 'Verified' | 'Failed' | 'In Progress';
  confidence: number;
};


export type VerificationRequest = {
  id: string;
  userId: string;
  documentType: string;
  uploadTimestamp: string;
  verificationStatus: 'pending' | 'processing' | 'Failed' | 'Verified';
  authenticityScore: number;
  isReal: boolean;
  documentAiResponse: string;
}
