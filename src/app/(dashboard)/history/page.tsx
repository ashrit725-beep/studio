'use client';
import { useState, useEffect } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import HistoryTable from "@/components/dashboard/HistoryTable";
import { VerificationRequest } from "@/types";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";


export default function HistoryPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const userHistoryQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'users', user.uid, 'verificationRequests'), orderBy('uploadTimestamp', 'desc'));
    }, [firestore, user]);

    const { data: history, isLoading } = useCollection<VerificationRequest>(userHistoryQuery);

  return (
    <div className="space-y-8">
      <HistoryTable data={history || []} isLoading={isLoading} />
    </div>
  );
}
