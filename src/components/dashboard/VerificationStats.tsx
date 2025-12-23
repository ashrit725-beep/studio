"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { VerificationRequest } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface VerificationStatsProps {
    recentVerifications: VerificationRequest[];
}

export default function VerificationStats({ recentVerifications }: VerificationStatsProps) {
  const last5Verifications = recentVerifications.slice(0, 5);
  const totalVerified = last5Verifications.filter(v => v.isReal).length;
  const totalFailed = last5Verifications.filter(v => !v.isReal).length;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Summary of your last 5 verifications.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-around">
                 <div className="text-center">
                    <p className="text-2xl font-bold">{totalVerified}</p>
                    <p className="text-sm text-muted-foreground">Verified</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold">{totalFailed}</p>
                    <p className="text-sm text-muted-foreground">Failed</p>
                </div>
                 <div className="text-center">
                    <p className="text-2xl font-bold">{last5Verifications.length}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                </div>
            </CardContent>
        </Card>
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Recent Verifications</CardTitle>
                <CardDescription>A log of your most recent checks.</CardDescription>
            </CardHeader>
            <CardContent>
                {last5Verifications.length === 0 ? (
                    <p className="text-muted-foreground text-center">No recent verifications.</p>
                ) : (
                    <ul className="space-y-3">
                        {last5Verifications.map((verification) => (
                             <li key={verification.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                                <span className="font-medium">{verification.documentType}</span>
                                <Badge variant={verification.isReal ? "default" : "destructive"}>
                                    {verification.isReal ? <CheckCircle className="h-4 w-4 mr-1"/> : <XCircle className="h-4 w-4 mr-1" />}
                                    {Math.round(verification.authenticityScore * 100)}%
                                </Badge>
                             </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
