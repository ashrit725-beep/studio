"use client"

import { TrendingUp, TrendingDown, CheckCircle, XCircle } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts"
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

const monthlyVerificationsData = [
  { month: "January", count: 186, fill: "var(--color-desktop)" },
  { month: "February", count: 305, fill: "var(--color-desktop)" },
  { month: "March", count: 237, fill: "var(--color-desktop)" },
  { month: "April", count: 273, fill: "var(--color-desktop)" },
  { month: "May", count: 209, fill: "var(--color-desktop)" },
  { month: "June", count: 214, fill: "var(--color-desktop)" },
];

const monthlyVerificationsConfig = {
  count: {
    label: "Verifications",
  },
  desktop: {
    label: "Verifications",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


const statusData = [
    { status: "Verified", count: 45, fill: "hsl(var(--chart-2))" },
    { status: "Failed", count: 8, fill: "hsl(var(--destructive))" },
]
  
const statusChartConfig = {
    count: {
      label: "Count",
    },
    verified: {
      label: "Verified",
      color: "hsl(var(--chart-2))",
    },
    failed: {
      label: "Failed",
      color: "hsl(var(--destructive))",
    },
  } satisfies ChartConfig

export default function UsageCharts() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-7">
        <Card className="lg:col-span-4">
            <CardHeader>
            <CardTitle>Monthly Verifications</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
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
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="count" radius={8}>
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
            <div className="flex gap-2 font-medium leading-none">
                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
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
                    <div className="flex items-baseline gap-2 text-2xl font-bold text-green-500 tabular-nums">
                        84.9%
                        <span className="text-sm font-normal text-muted-foreground">Success Rate</span>
                    </div>
                </div>
                 <ChartContainer
                    config={statusChartConfig}
                    className="aspect-auto h-[140px] w-full"
                    >
                    <BarChart
                        accessibilityLayer
                        layout="vertical"
                        data={statusData}
                        margin={{ left: -20, top: 10, bottom: 10 }}
                    >
                        <XAxis type="number" dataKey="count" hide />
                        <YAxis
                        dataKey="status"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        tick={false}
                        />
                        <Bar
                            dataKey="count"
                            layout="vertical"
                            radius={5}
                        >
                        <LabelList
                            dataKey="status"
                            position="insideLeft"
                            offset={8}
                            className="fill-white font-semibold"
                            fontSize={12}
                            />
                        <LabelList
                            dataKey="count"
                            position="right"
                            offset={8}
                            className="fill-foreground font-semibold"
                            fontSize={12}
                        />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
             <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none items-center text-green-500">
                    <CheckCircle className="h-4 w-4" /> 45 Verifications successful
                </div>
                <div className="flex gap-2 font-medium leading-none items-center text-red-500">
                    <XCircle className="h-4 w-4" /> 8 Verifications failed
                </div>
            </CardFooter>
        </Card>
    </div>
  )
}
