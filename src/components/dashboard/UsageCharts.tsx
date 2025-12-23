"use client"

import { TrendingUp, TrendingDown, CheckCircle, XCircle } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, Pie, PieChart, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart"
import { VerificationRequest } from "@/types"
import { useMemo } from "react"
import { format, subMonths, getMonth } from 'date-fns'


const monthlyVerificationsConfig = {
  count: {
    label: "Verifications",
  },
  desktop: {
    label: "Verifications",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;
  
const statusChartConfig = {
    count: {
      label: "Count",
    },
    Verified: {
      label: "Verified",
      color: "hsl(var(--chart-2))",
    },
    Failed: {
      label: "Failed",
      color: "hsl(var(--destructive))",
    },
  } satisfies ChartConfig

interface UsageChartsProps {
  verificationData: VerificationRequest[];
}

export default function UsageCharts({ verificationData }: UsageChartsProps) {
    const monthlyVerificationsData = useMemo(() => {
        const last6Months = Array.from({ length: 6 }).map((_, i) => subMonths(new Date(), i)).reverse();
        const monthlyCounts = last6Months.map(monthDate => {
            const monthName = format(monthDate, 'MMMM');
            const month = getMonth(monthDate);

            const count = verificationData.filter(v => getMonth(new Date(v.uploadTimestamp)) === month).length;
            return { month: monthName, count };
        });
        return monthlyCounts;
    }, [verificationData]);

    const statusData = useMemo(() => {
        const verified = verificationData.filter(v => v.verificationStatus === 'Verified').length;
        const failed = verificationData.filter(v => v.verificationStatus === 'Failed').length;
        const total = verified + failed;
        if(total === 0) return [];
        return [
            { status: "Verified", count: verified, fill: "hsl(var(--chart-2))" },
            { status: "Failed", count: failed, fill: "hsl(var(--destructive))" },
        ]
    }, [verificationData]);

    const successRate = useMemo(() => {
        const total = verificationData.length;
        if (total === 0) return 0;
        const verified = verificationData.filter(v => v.isReal).length;
        return (verified / total) * 100;
    }, [verificationData]);


  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-7">
        <Card className="lg:col-span-4">
            <CardHeader>
            <CardTitle>Monthly Verifications</CardTitle>
            <CardDescription>{format(subMonths(new Date(), 5), 'MMMM')} - {format(new Date(), 'MMMM')} {format(new Date(), 'yyyy')}</CardDescription>
            </CardHeader>
            <CardContent>
            <ChartContainer config={monthlyVerificationsConfig}>
                <BarChart
                accessibilityLayer
                data={monthlyVerificationsData}
                margin={{
                    top: 20,
                }}
                >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis dataKey="count" hide/>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="count" radius={8} fill="hsl(var(--primary))">
                    <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                    />
                </Bar>
                </BarChart>
            </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
                Showing total verifications for the last 6 months
            </div>
            </CardFooter>
        </Card>
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Verification Outcomes</CardTitle>
                <CardDescription>All-time distribution</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid auto-rows-min gap-2">
                    <div className="flex items-baseline gap-2 text-2xl font-bold text-primary tabular-nums">
                        {successRate.toFixed(1)}%
                        <span className="text-sm font-normal text-muted-foreground">Success Rate</span>
                    </div>
                </div>
                 <ChartContainer
                    config={statusChartConfig}
                    className="aspect-auto h-[140px] w-full"
                    >
                     <PieChart>
                         <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                         <Pie data={statusData} dataKey="count" nameKey="status" innerRadius={50}>
                             {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                         </Pie>
                     </PieChart>
                </ChartContainer>
            </CardContent>
             <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none items-center text-green-500">
                    <CheckCircle className="h-4 w-4" /> {statusData.find(d => d.status === 'Verified')?.count || 0} Verifications successful
                </div>
                <div className="flex gap-2 font-medium leading-none items-center text-red-500">
                    <XCircle className="h-4 w-4" /> {statusData.find(d => d.status === 'Failed')?.count || 0} Verifications failed
                </div>
            </CardFooter>
        </Card>
    </div>
  )
}
