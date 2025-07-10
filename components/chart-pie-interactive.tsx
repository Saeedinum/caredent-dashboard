"use client"

import * as React from "react"
import { Cell, Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AppointmentStatus {
  status: string;
  count: number;
  percentage: number;
}
// Default data to show while loading
const defaultAppointmentData: AppointmentStatus[] = [
  { status: "Completed", count: 0, percentage: 0 },
  { status: "In Progress", count: 0, percentage: 0 },
]

// Colors for the appointment status chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const chartConfig = {
  appointments: {
    label: "Appointments",
  },
  count: {
    label: "Count",
  },
  percentage: {
    label: "Percentage",
  },
  "Completed": {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  "In Progress": {
    label: "In Progress",
    color: "hsl(var(--chart-2))",
  },
  "Cancelled": {
    label: "Cancelled",
    color: "hsl(var(--chart-3))",
  },
  "Rescheduled": {
    label: "Rescheduled",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function Component() {
  const id = "pie-interactive"
  const [appointmentStatus, setAppointmentStatus] = React.useState<AppointmentStatus[]>(defaultAppointmentData)
  const [activeStatus, setActiveStatus] = React.useState<string>(defaultAppointmentData[0].status)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchAppointmentStatus = async () => {
      try {
        const response = await fetch('https://dentaldashboarddd-f2f4b0arc5gdh2ct.germanywestcentral-01.azurewebsites.net/api/appointments_status');
        if (!response.ok) {
          throw new Error('Failed to fetch appointment status data');
        }
        const data = await response.json();
        setAppointmentStatus(data);
        if (data.length > 0) {
          setActiveStatus(data[0].status);
        }
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchAppointmentStatus();
  }, []);

  const activeIndex = React.useMemo(
    () => appointmentStatus.findIndex((item) => item.status === activeStatus),
    [appointmentStatus, activeStatus]
  )
  
  const statuses = React.useMemo(() => 
    appointmentStatus.map((item) => item.status), 
    [appointmentStatus]
  )

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Appointment Status</CardTitle>
          <CardDescription>Current appointment distribution</CardDescription>
        </div>
        {!loading && !error && (
          <Select value={activeStatus} onValueChange={setActiveStatus}>
            <SelectTrigger
              className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
              aria-label="Select a status"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              {statuses.map((status) => {
                const config = chartConfig[status as keyof typeof chartConfig]

                if (!config) {
                  return null
                }

              return (
                <SelectItem
                  key={status}
                  value={status}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: COLORS[statuses.indexOf(status) % COLORS.length],
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p>Loading appointment data...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <ChartContainer
            id={id}
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={appointmentStatus}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={activeIndex}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 10} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 25}
                      innerRadius={outerRadius + 12}
                    />
                  </g>
                )}
              >
                {appointmentStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox && activeIndex >= 0) {
                      const activeData = appointmentStatus[activeIndex];
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {activeData.count.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {activeData.percentage.toFixed(1)}%
                          </tspan>
                        </text>
                      )
                    }
                    return null;
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
