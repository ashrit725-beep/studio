'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, Pie, PieChart, Sector, XAxis } from 'recharts';
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
  },
  desktop: {
    label: 'Verifications',
    color: 'hsl(var(--primary))',
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

  const activeSegment = useMemo(() => {
    if (statusData.length === 0) return { count: 0, status: 'No data' };
    return statusData[activeIndex];
  }, [activeIndex, statusData]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Verifications</CardTitle>
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
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Bar dataKey="count" radius={8} fill="url(#fillDesktop)">
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

      <Card>
        <CardHeader>
          <CardTitle>Verification Outcomes</CardTitle>
          <CardDescription>All-time distribution of verification results.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={statusChartConfig}
            className="mx-auto aspect-square h-[250px]"
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
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex w-full items-center justify-center gap-2 font-medium leading-none">
            {statusData.length > 0 ? (
              <>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: activeSegment?.fill }}
                />
                <div className="leading-none">
                  {activeSegment?.status}: {activeSegment?.count}
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