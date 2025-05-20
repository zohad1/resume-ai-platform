// app/components/resume-stats.tsx
"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface ResumeStatsProps {
  monthlyData: { month: string; total: number }[];
}

export function ResumeStats({ monthlyData }: ResumeStatsProps) {
  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} className="fill-emerald-600" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
