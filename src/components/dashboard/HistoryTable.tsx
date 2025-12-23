"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VerificationHistoryItem } from "@/types";

interface HistoryTableProps {
  data: VerificationHistoryItem[];
  isLoading?: boolean;
}

const statusVariantMap: { [key in VerificationHistoryItem['status']]: "default" | "destructive" | "secondary" } = {
    'Verified': 'default',
    'Failed': 'destructive',
    'In Progress': 'secondary'
}

export default function HistoryTable({ data, isLoading }: HistoryTableProps) {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Verification History</CardTitle>
            <CardDescription>A record of all your past document verifications.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Confidence</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                ) : data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No verification history found.
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((item) => (
                        <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.documentType}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                            <Badge variant={statusVariantMap[item.status]}>{item.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            {item.status === 'In Progress' ? 'N/A' : `${(item.confidence * 100).toFixed(0)}%`}
                        </TableCell>
                        </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
