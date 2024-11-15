"use client";

import { Card } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { time: "00:00", price: 0.1 },
  { time: "04:00", price: 0.12 },
  { time: "08:00", price: 0.11 },
  { time: "12:00", price: 0.15 },
  { time: "16:00", price: 0.13 },
  { time: "20:00", price: 0.14 },
  { time: "24:00", price: 0.16 },
];

export function PriceChart() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Price Chart</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}