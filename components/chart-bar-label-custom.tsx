"use client";

import {TrendingUp} from "lucide-react";
import {Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis} from "recharts";

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {useEffect, useState} from "react";

export const description = "A bar chart showing student ratings distribution from 1 to 5 stars";

const chartConfig = {
	students: {
		label: "Students",
		color: "var(--chart-1)",
	},
	label: {
		color: "var(--background)",
	},
} satisfies ChartConfig;

export function ChartBarLabelCustom() {
	const [ratingsData, setRatingsData] = useState<{_id: number; count: number}[]>([]);

	useEffect(() => {
		fetch("https://dentaldashboarddd-f2f4b0arc5gdh2ct.germanywestcentral-01.azurewebsites.net/api/ratings_distribution")
			.then((res) => res.json())
			.then((data) => setRatingsData(data))
			.catch((err) => console.error("Failed to fetch ratings data:", err));
	}, []);

	const fullRatings = [1, 2, 3, 4, 5].map((rating) => {
		const found = ratingsData.find((item) => item._id === rating);
		return {_id: rating, count: found ? found.count : 0};
	});

	const chartData = fullRatings.map((item) => ({
		rating: `${item._id} Star${item._id > 1 ? "s" : ""}`,
		students: item.count,
	}));

	return (
		<Card>
			<CardHeader>
				<CardTitle>Student Ratings Distribution</CardTitle>
				<CardDescription>Ratings from 1 to 5 stars</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart data={chartData} margin={{top: 20, right: 16, left: 16, bottom: 20}} barCategoryGap={30} barGap={8} width={400} height={220}>
						<CartesianGrid vertical={false} strokeDasharray='3 3' stroke='#e0e7ff' />
						<XAxis dataKey='rating' tickLine={false} tickMargin={12} axisLine={false} style={{fontWeight: 600, fill: "#6366f1", fontSize: 15}} />
						<YAxis hide />
						<ChartTooltip cursor={{fill: "#6366f1", fillOpacity: 0.08}} content={<ChartTooltipContent />} />
						<Bar dataKey='students' fill='#6366f1' radius={[10, 10, 0, 0]} maxBarSize={48} minPointSize={8}>
							<LabelList dataKey='students' position='top' offset={6} className='fill-indigo-700' fontSize={16} style={{fontWeight: 700}} />
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col items-start gap-2 text-sm'>
				<div className='flex gap-2 leading-none font-medium'>
					Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
				</div>
				<div className='text-muted-foreground leading-none'>Showing distribution of student ratings</div>
			</CardFooter>
		</Card>
	);
}
