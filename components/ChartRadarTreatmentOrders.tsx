"use client";

import * as React from "react";
import {PolarAngleAxis, PolarGrid, Radar, RadarChart} from "recharts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const TREATMENT_TYPES = ["Tooth Extraction", "Veneers", "Root Canal Treatment", "Dental Filling", "Scaling & Polishing", "Orthodontics (Braces)"];

export function ChartRadarTreatmentOrders() {
	const [rawData, setRawData] = React.useState<{_id: {type: string; month: number}; count: number}[]>([]);
	const [selectedMonth, setSelectedMonth] = React.useState<number | null>(null);

	React.useEffect(() => {
		fetch("https://dentaldashboarddd-f2f4b0arc5gdh2ct.germanywestcentral-01.azurewebsites.net/api/treatment_orders_by_month")
			.then((res) => res.json())
			.then((data) => {
				setRawData(data);

				const months = Array.from(new Set(data.map((d: {_id: {month: number}}) => d._id?.month ?? null)))
					.filter((m): m is number => typeof m === "number")
					.sort();

				setSelectedMonth(months.length > 0 ? months[0] : null);
			})
			.catch((err) => console.error("Failed to fetch treatment data:", err));
	}, []);

	const months = React.useMemo(
		() =>
			Array.from(new Set(rawData.map((d) => d._id?.month ?? null)))
				.filter((m): m is number => typeof m === "number")
				.sort(),
		[rawData],
	);

	const radarData = React.useMemo(() => {
		if (selectedMonth === null) return [];

		const entries = rawData
			.filter((d) => d._id.month === selectedMonth)
			.reduce((acc, cur) => {
				acc[cur._id.type] = cur.count;
				return acc;
			}, {} as Record<string, number>);

		return TREATMENT_TYPES.map((type) => ({
			type,
			count: entries[type] ?? 0,
		}));
	}, [rawData, selectedMonth]);

	const chartConfig: ChartConfig = TREATMENT_TYPES.reduce((cfg, type, i) => {
		cfg[type] = {
			label: type,
			color: `var(--chart-${(i % 6) + 1})`,
		};
		return cfg;
	}, {} as ChartConfig);

	if (selectedMonth === null || months.length === 0) return null;

	return (
		<Card className='flex flex-col'>
			<ChartStyle id='radar-treatment' config={chartConfig} />
			<CardHeader className='flex items-center justify-between pb-4'>
				<div>
					<CardTitle>Treatment Orders by Type</CardTitle>
					<CardDescription>Select a month to compare types</CardDescription>
				</div>
				<Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(Number(v))}>
					<SelectTrigger className='w-[120px]'>
						<SelectValue placeholder='Month' />
					</SelectTrigger>
					<SelectContent align='end'>
						{months.map((m) => (
							<SelectItem key={m} value={m.toString()}>
								{new Date(0, m - 1).toLocaleString("default", {
									month: "long",
								})}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardHeader>

			<CardContent className='pb-0'>
				<ChartContainer id='radar-treatment' config={chartConfig} className='mx-auto aspect-square max-w-[300px]'>
					<RadarChart data={radarData}>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
						<PolarGrid gridType='circle' radialLines={false} />
						<PolarAngleAxis dataKey='type' />
						<Radar dataKey='count' fill='var(--chart-1)' fillOpacity={0.6} dot={{r: 4, fillOpacity: 1}} />
					</RadarChart>
				</ChartContainer>
			</CardContent>

			<CardFooter className='flex items-center justify-between text-sm'>
				<div className='font-medium'>
					Month:{" "}
					{new Date(0, selectedMonth - 1).toLocaleString("default", {
						month: "long",
					})}
				</div>
				<div className='text-muted-foreground'>Treatment types: {TREATMENT_TYPES.length}</div>
			</CardFooter>
		</Card>
	);
}
