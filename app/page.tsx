"use client";

import {useEffect, useState} from "react";
import Aside from "@/components/Aside";
import {ChartBarLabelCustom} from "@/components/chart-bar-label-custom";
import {ChartPieInteractive} from "@/components/chart-pie-interactive";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowUp} from "lucide-react";
import {ChartRadarTreatmentOrders} from "@/components/ChartRadarTreatmentOrders";

export default function DashboardPage() {
	const [appointmentData, setAppointmentData] = useState<{status: string; count: number; percentage: number}[]>([]);

	useEffect(() => {
		fetch("https://dentaldashboarddd-f2f4b0arc5gdh2ct.germanywestcentral-01.azurewebsites.net/api/appointments_status")
			.then((res) => res.json())
			.then((data) => setAppointmentData(data))
			.catch((err) => console.error("Failed to fetch appointment data:", err));
	}, []);

	const totalAppointments = appointmentData.reduce((sum, item) => sum + item.count, 0);

	return (
		<main className='min-h-screen bg-gray-50 justify-between flex p-10'>
			<div className='flex flex-col items-center flex-1'>
				{/* Top Section: Stats */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
					{[
						{title: "Doctors", value: 55, growth: "+11.01%"}, // no data from server
						{title: "Patients", value: 70, growth: "+15.77%"}, // no data from server
						{title: "Appointments", value: totalAppointments, growth: "+20.66%"}, // no data from server
					].map(({title, value, growth}) => (
						<Card key={title} className='bg-gradient-to-br w-[250px] from-blue-100 to-blue-300 shadow-md'>
							<CardHeader>
								<CardTitle className='text-xl font-bold text-blue-800'>{title}</CardTitle>
							</CardHeader>
							<CardContent className='flex gap-5'>
								<div className='text-4xl font-extrabold text-blue-900'>{value}</div>
								<div className='mt-2 flex items-center text-green-600 font-semibold'>
									<ArrowUp className='w-4 h-4 mr-1' />
									{growth}
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Middle Section: 2 Charts */}
				<div className='w-full gap-2 *:w-[500px] flex justify-center'>
					<ChartPieInteractive appointmentData={appointmentData} />
					<ChartBarLabelCustom />
					<ChartRadarTreatmentOrders />
				</div>
			</div>

			{/* Aside Section */}
			<div className='flex flex-col md:flex-row gap-6'>
				<Aside />
			</div>
		</main>
	);
}
