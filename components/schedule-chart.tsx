"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface ChartData {
  day: string
  count: number
}

interface ScheduleChartProps {
  data: ChartData[]
}

export function ScheduleChart({ data }: ScheduleChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Day</span>
                      <span className="font-bold text-muted-foreground">{label}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Schedules</span>
                      <span className="font-bold">{payload[0].value}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar dataKey="count" className="fill-primary" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
