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
import { VerificationHistoryItem } from "@/types";

interface HistoryTableProps {
  data: VerificationHistoryItem[];
}

const statusVariantMap: { [key in VerificationHistoryItem['status']]: "default" | "destructive" | "secondary" } = {
    'Verified': 'default',
    'Failed': 'destructive',
    'In Progress': 'secondary'
}

export default function HistoryTable({ data }: HistoryTableProps) {
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
                {data.map((item) => (
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
                ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
