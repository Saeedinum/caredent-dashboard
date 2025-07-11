"use client";

import * as React from "react";
import {Label, Pie, PieChart, Sector} from "recharts";
import {PieSectorDataItem} from "recharts/types/polar/Pie";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export const description = "Pie chart showing completed vs in-progress appointments";

const chartConfig = {
	"Completed": {
		label: "Completed",
		color: "var(--chart-1)",
	},
	"In Progress": {
		label: "In Progress",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

export function ChartPieInteractive() {
	const id = "pie-interactive";
	const [appointmentData, setAppointmentData] = React.useState<{status: string; count: number; percentage: number}[]>([]);
	const [activeStatus, setActiveStatus] = React.useState("Completed");

	React.useEffect(() => {
		fetch("https://dentaldashboarddd-f2f4b0arc5gdh2ct.germanywestcentral-01.azurewebsites.net/api/appointments_status")
			.then((res) => res.json())
			.then((data) => {
				setAppointmentData(data);
				setActiveStatus(data[0]?.status || "Completed");
			})
			.catch((err) => console.error("Failed to fetch appointment data:", err));
	}, []);

	const pieData = appointmentData.map((item) => ({
		name: item.status,
		value: item.count,
		fill: item.status === "Completed" ? "var(--chart-1)" : "var(--chart-2)",
	}));

	const activeIndex = pieData.findIndex((item) => item.name === activeStatus);
	const total = appointmentData.reduce((sum, item) => sum + item.count, 0);

	return (
		<Card data-chart={id} className='flex flex-col'>
			<ChartStyle id={id} config={chartConfig} />
			<CardHeader className='flex-row items-start space-y-0 pb-0'>
				<div className='grid gap-1'>
					<CardTitle>Appointments Overview</CardTitle>
					<CardDescription>Completed vs In Progress</CardDescription>
				</div>
				<Select value={activeStatus} onValueChange={setActiveStatus}>
					<SelectTrigger className='ml-auto h-7 w-[130px] rounded-lg pl-2.5'>
						<SelectValue placeholder='Select status' />
					</SelectTrigger>
					<SelectContent align='end' className='rounded-xl'>
						{appointmentData.map((item) => (
							<SelectItem key={item.status} value={item.status}>
								{item.status}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className='flex flex-1 justify-center pb-0'>
				<ChartContainer id={id} config={chartConfig} className='mx-auto aspect-square w-full max-w-[300px]'>
					<PieChart>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
						<Pie
							data={pieData}
							dataKey='value'
							nameKey='name'
							innerRadius={60}
							strokeWidth={5}
							activeIndex={activeIndex}
							activeShape={({outerRadius = 0, ...props}: PieSectorDataItem) => (
								<g>
									<Sector {...props} outerRadius={outerRadius + 10} />
									<Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
								</g>
							)}
						>
							<Label
								content={({viewBox}) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
												<tspan x={viewBox.cx} y={viewBox.cy} className='fill-foreground text-3xl font-bold'>
													{total}
												</tspan>
												<tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className='fill-muted-foreground'>
													Appointments
												</tspan>
											</text>
										);
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
