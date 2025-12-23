'use client';
import { useState, useEffect } from "react";
import HistoryTable from "@/components/dashboard/HistoryTable";
import { VerificationHistoryItem } from "@/types";

// This is still mock data, but we're setting it up to be replaced by a real API call.
const getMockHistory = (): Promise<VerificationHistoryItem[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { id: '1', documentType: 'Passport', date: '2024-07-15', status: 'Verified', confidence: 0.98 },
                { id: '2', documentType: 'Driver\'s License', date: '2024-07-14', status: 'Verified', confidence: 0.92 },
                { id: '3', documentType: 'National ID', date: '2024-07-12', status: 'Failed', confidence: 0.34 },
                { id: '4', documentType: 'Passport', date: '2024-07-10', status: 'Verified', confidence: 0.99 },
                { id: '5', documentType: 'Driver\'s License', date: '2024-07-08', status: 'Verified', confidence: 0.88 },
                { id: '6', documentType: 'National ID', date: '2024-07-05', status: 'In Progress', confidence: 0.0 },
            ]);
        }, 500);
    });
};


export default function HistoryPage() {
    const [history, setHistory] = useState<VerificationHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            const data = await getMockHistory();
            setHistory(data);
            setIsLoading(false);
        };

        fetchHistory();
    }, []);


  return (
    <div className="space-y-8">
      <HistoryTable data={history} isLoading={isLoading} />
    </div>
  );
}
