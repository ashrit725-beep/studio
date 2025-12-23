export type VerificationHistoryItem = {
  id: string;
  documentType: string;
  date: string;
  status: 'Verified' | 'Failed' | 'In Progress';
  confidence: number;
};
