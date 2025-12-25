'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, Pie, PieChart, Sector, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { VerificationRequest } from '@/types';
import { useMemo, useState } from 'react';
import { format, subMonths, getMonth } from 'date-fns';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

const monthlyVerificationsConfig = {
  count: {
    label: 'Verifications',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const statusChartConfig = {
  count: {
    label: 'Count',
  },
  Verified: {
    label: 'Verified',
    color: 'hsl(var(--chart-2))',
  },
  Failed: {
    label: 'Failed',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

interface UsageChartsProps {
  verificationData: VerificationRequest[];
}

export default function UsageCharts({ verificationData }: UsageChartsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const monthlyVerificationsData = useMemo(() => {
    const last6Months = Array.from({ length: 6 })
      .map((_, i) => subMonths(new Date(), i))
      .reverse();
    const monthlyCounts = last6Months.map(monthDate => {
      const monthName = format(monthDate, 'MMM');
      const month = getMonth(monthDate);

      const count = verificationData.filter(v => getMonth(new Date(v.uploadTimestamp)) === month)
        .length;
      return { month: monthName, count };
    });
    return monthlyCounts;
  }, [verificationData]);

  const statusData = useMemo(() => {
    const verified = verificationData.filter(v => v.verificationStatus === 'Verified').length;
    const failed = verificationData.filter(v => v.verificationStatus === 'Failed').length;
    const total = verified + failed;
    if (total === 0) return [];
    return [
      { status: 'Verified', count: verified, fill: 'var(--color-Verified)' },
      { status: 'Failed', count: failed, fill: 'var(--color-Failed)' },
    ];
  }, [verificationData]);

  const totalVerifications = useMemo(() => verificationData.length, [verificationData]);
  const totalVerified = useMemo(() => statusData.find(d => d.status === 'Verified')?.count || 0, [statusData]);
  const totalFailed = useMemo(() => statusData.find(d => d.status === 'Failed')?.count || 0, [statusData]);


  const activeSegment = useMemo(() => {
    if (statusData.length === 0) return { count: 0, status: 'No data', fill: 'hsl(var(--muted))' };
    return statusData[activeIndex];
  }, [activeIndex, statusData]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Monthly Verification Activity</CardTitle>
          <CardDescription>
            Total verifications conducted over the last 6 months.
          </CardDescription>
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
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              
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
          <div className="flex gap-2 font-medium leading-none text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-green-500" /> This shows an upward trend in verification activities.
          </div>
          <div className="leading-none text-muted-foreground">
            A consistent increase suggests growing usage and trust in the platform.
          </div>
        </CardFooter>
      </Card>

      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader>
          <CardTitle>Verification Outcomes</CardTitle>
          <CardDescription>All-time distribution of verification results.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center pb-0">
          <ChartContainer
            config={statusChartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={activeIndex}
                activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 10} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius}
                      innerRadius={outerRadius - 4}
                    />
                  </g>
                )}
                onMouseEnter={(_, index) => setActiveIndex(index)}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-4 text-sm pt-4">
          <div className="flex w-full items-center justify-center gap-2 font-medium leading-none">
            {statusData.length > 0 ? (
                <>
                <div
                    className="flex items-center gap-2"
                    style={{ color: statusData.find(d => d.status === 'Verified')?.fill }}
                >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusData.find(d => d.status === 'Verified')?.fill }} />
                    Verified: {((totalVerified / totalVerifications) * 100).toFixed(0)}%
                </div>
                <div
                    className="flex items-center gap-2"
                    style={{ color: statusData.find(d => d.status === 'Failed')?.fill }}
                >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusData.find(d => d.status === 'Failed')?.fill }} />
                    Failed: {((totalFailed / totalVerifications) * 100).toFixed(0)}%
                </div>
                </>
            ) : (
              'No data to display'
            )}
          </div>
          <div className="leading-none text-muted-foreground">
            Total Verifications: {totalVerifications}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
