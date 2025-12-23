"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart"

const chartData = [
  { month: "January", verifications: 186 },
  { month: "February", verifications: 305 },
  { month: "March", verifications: 237 },
  { month: "April", verifications: 273 },
  { month: "May", verifications: 209 },
  { month: "June", verifications: 214 },
]

const chartConfig = {
  verifications: {
    label: "Verifications",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

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
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Verifications This Year</CardTitle>
          <CardDescription>Monthly verification counts</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="verifications"
                type="monotone"
                stroke="var(--color-verifications)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
      <CardHeader>
          <CardTitle>Verification Status</CardTitle>
          <CardDescription>Distribution of verification outcomes</CardDescription>
        </CardHeader>
        <CardContent>
        <ChartContainer config={statusChartConfig} className="h-64">
            <BarChart data={statusData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="status"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={60}
              />
              <XAxis type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
