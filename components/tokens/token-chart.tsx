'use client';

import { useRecentTransactions } from '@/hooks/use-recent-transactions';
import { Token } from "@/lib/types";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Legend,
  CartesianGrid
} from "recharts";
import { startOfHour, format, subHours } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTokenPrice } from "@/hooks/use-token-price";
import { useTokenStore } from '@/lib/store/token-store';
import { useState, useEffect } from 'react';

interface TokenChartProps {
  token: Token;
}

interface HourlyVolume {
  hour: string;
  buyVolume: number;
  sellVolume: number;
  timestamp: Date;
}

export function TokenChart({ token }: TokenChartProps) {
  const tokenData = useTokenStore((state) => state.tokens[token.address]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  useEffect(() => {
    if (tokenData?.lastUpdate) {
      setLastUpdate(tokenData.lastUpdate);
    }
  }, [tokenData?.lastUpdate]);

  const { ethUsdPrice } = useTokenPrice(token.address);
  const transactions = tokenData?.transactions || [];

  // Create array of last 24 hours
  const last24Hours = Array.from({ length: 24 }, (_, i) => {
    const date = subHours(new Date(), 23 - i); // Start from 23 hours ago
    return startOfHour(date);
  });

  // Initialize map with all hours
  const initialHourlyMap = new Map<string, HourlyVolume>(
    last24Hours.map(hour => [
      hour.toISOString(),
      {
        hour: format(hour, 'HH:mm'),
        buyVolume: 0,
        sellVolume: 0,
        timestamp: hour,
      }
    ])
  );

  // Process transactions into hourly volumes
  const hourlyVolumes = transactions.reduce((acc: Map<string, HourlyVolume>, tx) => {
    const hour = startOfHour(tx.timestamp);
    const hourKey = hour.toISOString();
    
    // Only process if hour is within our 24-hour window
    if (acc.has(hourKey)) {
      const existing = acc.get(hourKey)!;

      if (tx.type === 'Buy') {
        existing.buyVolume += Number(tx.ethSpent);
      } else if (tx.type === 'Sell') {
        existing.sellVolume += Number(tx.ethReceived);
      }

      acc.set(hourKey, existing);
    }
    
    return acc;
  }, initialHourlyMap);

  // Convert to array and sort by timestamp
  const data = Array.from(hourlyVolumes.values())
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const buyVolumeUsd = data.buyVolume * ethUsdPrice;
      const sellVolumeUsd = data.sellVolume * ethUsdPrice;
      const totalVolumeUsd = buyVolumeUsd + sellVolumeUsd;

      return (
        <Card className="border">
          <CardContent className="p-3 space-y-1">
            <p className="font-medium text-sm">{data.hour}</p>
            <p className="text-sm text-green-500">
              Buy: {data.buyVolume.toFixed(4)} ETH (${buyVolumeUsd.toFixed(2)})
            </p>
            <p className="text-sm text-red-500">
              Sell: {data.sellVolume.toFixed(4)} ETH (${sellVolumeUsd.toFixed(2)})
            </p>
            <p className="text-sm text-muted-foreground pt-1 border-t">
              Total: {(data.buyVolume + data.sellVolume).toFixed(4)} ETH (${totalVolumeUsd.toFixed(2)})
            </p>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center gap-4 text-sm mt-2">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>24h Volume History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              stackOffset="none"
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <filter id="shadow" height="200%">
                  <feDropShadow dx="5" dy="8" stdDeviation="5" floodOpacity="0.3"/>
                </filter>
                <linearGradient id="buyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(34 197 94)" stopOpacity={1}/>
                  <stop offset="100%" stopColor="rgb(34 197 94)" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="sellGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(239 68 68)" stopOpacity={1}/>
                  <stop offset="100%" stopColor="rgb(239 68 68)" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="hsl(var(--muted-foreground) / 0.1)"
              />
              <XAxis 
                dataKey="hour" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                axisLine={false}
                tickLine={false}
                dy={10}
                interval={1}
                tickFormatter={(value, index) => index % 1 === 0 ? value : ''}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${value.toFixed(4)}`}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'hsl(var(--muted) / 0.1)' }}
              />
              <Legend content={<CustomLegend />} />
              <Bar
                dataKey="buyVolume"
                fill="rgb(34 197 94)"
                name="Buy Volume"
                stackId="volume"
                filter="url(#shadow)"
              />
              <Bar
                dataKey="sellVolume"
                fill="rgb(239 68 68)"
                name="Sell Volume"
                stackId="volume"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
