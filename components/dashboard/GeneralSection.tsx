"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AppointmentStatus {
  status: string;
  count: number;
  percentage: number;
}

const GeneralSection = () => {
	const [appointmentStatus, setAppointmentStatus] = useState<AppointmentStatus[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchAppointmentStatus = async () => {
			try {
				const response = await fetch('https://dentaldashboarddd-f2f4b0arc5gdh2ct.germanywestcentral-01.azurewebsites.net/api/appointments_status')
				if (!response.ok) {
					throw new Error('Failed to fetch appointment status data')
				}
				const data = await response.json()
				setAppointmentStatus(data)
				setLoading(false)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred')
				setLoading(false)
			}
		}

		fetchAppointmentStatus()
	}, [])

	// Colors for the appointment status chart
	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">General Dashboard</h1>
		
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-2">Total Students</h2>
					<p className="text-3xl font-bold">1,234</p>
					<p className="text-green-500 mt-2">+5% from last month</p>
				</div>
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-2">Total Patients</h2>
					<p className="text-3xl font-bold">5,678</p>
					<p className="text-green-500 mt-2">+3% from last month</p>
				</div>
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-2">Appointments Today</h2>
					<p className="text-3xl font-bold">42</p>
					<p className="text-blue-500 mt-2">8 remaining</p>
				</div>
			</div>
				{/* Appointment Status Chart */}
				<Card className="col-span-1">
					<CardHeader className="pb-2">
						<CardTitle className="text-xl font-semibold">Appointment Status</CardTitle>
						<CardDescription>Distribution of appointment statuses</CardDescription>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="flex items-center justify-center h-[200px]">
								<p>Loading appointment data...</p>
							</div>
						) : error ? (
							<div className="flex items-center justify-center h-[200px]">
								<p className="text-red-500">{error}</p>
							</div>
						) : (
							<div className="h-[200px]">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={appointmentStatus}
											cx="50%"
											cy="50%"
											labelLine={false}
											outerRadius={80}
											fill="#8884d8"
											dataKey="count"
											nameKey="status"
											label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
										>
											{appointmentStatus.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Pie>
										<Tooltip
											formatter={(value, name) => [`${value} appointments`, `${name}`]}
										/>
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</div>
						)}
					</CardContent>
				</Card>

		
		</div>
	)
}

export default GeneralSection;