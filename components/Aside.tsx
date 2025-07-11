"use client";
import React, {useEffect, useState} from "react";

const Aside = () => {
	const [students, setStudents] = useState<{fullName: string; appointmentsCount: number}[]>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTopActiveStudents = async () => {
			try {
				const response = await fetch("https://dentaldashboarddd-f2f4b0arc5gdh2ct.germanywestcentral-01.azurewebsites.net/api/top_active_students");
				if (!response.ok) {
					throw new Error("Failed to fetch top active students");
				}
				const data = await response.json();
				setStudents(data);
				setLoading(false);
			} catch (error) {
				setError(error instanceof Error ? error.message : "An error occurred");
				setLoading(false);
			}
		};

		fetchTopActiveStudents();
	}, []);

	return (
		<aside className='w-[300px] bg-white rounded-xl shadow-md p-4'>
			<h3 className='font-semibold text-lg mb-3 text-gray-700'>Top Active Students</h3>
			{loading ? (
				<p>Loading...</p>
			) : error ? (
				<p className='text-red-500'>{error}</p>
			) : (
				<ul className='space-y-2 mb-4'>
					{students?.map((student, index) => (
						<li key={index} className='bg-gray-100 rounded px-3 py-2 text-gray-600 flex justify-between'>
							<span>{student.fullName}</span>
							<span className='font-semibold'>{student.appointmentsCount}</span>
						</li>
					))}
				</ul>
			)}
		</aside>
	);
};

export default Aside;
