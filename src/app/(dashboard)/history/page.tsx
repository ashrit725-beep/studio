import HistoryTable from "@/components/dashboard/HistoryTable";
import { VerificationHistoryItem } from "@/types";

const mockHistory: VerificationHistoryItem[] = [
    { id: '1', documentType: 'Passport', date: '2024-06-15', status: 'Verified', confidence: 0.98 },
    { id: '2', documentType: 'Driver\'s License', date: '2024-06-14', status: 'Verified', confidence: 0.92 },
    { id: '3', documentType: 'National ID', date: '2024-06-12', status: 'Failed', confidence: 0.34 },
    { id: '4', documentType: 'Passport', date: '2024-06-10', status: 'Verified', confidence: 0.99 },
    { id: '5', documentType: 'Driver\'s License', date: '2024-06-08', status: 'Verified', confidence: 0.88 },
    { id: '6', documentType: 'National ID', date: '2024-06-05', status: 'In Progress', confidence: 0.0 },
];

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <HistoryTable data={mockHistory} />
    </div>
  );
}
