"use client";

import {useState} from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import {LayoutDashboard, GraduationCap, Users, Settings, HelpCircle} from "lucide-react";
import Image from "next/image";
import {GeneralSection, StudentsSection, PatientsSection} from "@/components/dashboard";

export default function Home() {
	const [activeSection, setActiveSection] = useState("general");

	return (
		<>
			<Sidebar>
				<SidebarHeader>
					<div className='flex items-center gap-2 px-2'>
						<Image src='/logo.svg' alt='CareDent Logo' width={160} height={100} />
					</div>
				</SidebarHeader>
				<SidebarContent>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton isActive={activeSection === "general"} tooltip='Dashboard' onClick={() => setActiveSection("general")}>
								<LayoutDashboard />
								<span>General</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton isActive={activeSection === "students"} tooltip='Students' onClick={() => setActiveSection("students")}>
								<GraduationCap />
								<span>Students</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton isActive={activeSection === "patients"} tooltip='Patients' onClick={() => setActiveSection("patients")}>
								<Users />
								<span>Patients</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>

					<SidebarGroup>
						<SidebarGroupLabel>System</SidebarGroupLabel>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton tooltip='Settings'>
									<Settings />
									<span>Settings</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton tooltip='Help'>
									<HelpCircle />
									<span>Help</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<div className='px-2 py-2 text-xs text-sidebar-foreground/70'>© 2023 CareDent Dashboard</div>
				</SidebarFooter>
			</Sidebar>
			<main className='flex-1 p-6'>
				<div className='container mx-auto'>
					{activeSection === "general" && <GeneralSection />}
					{activeSection === "students" && <StudentsSection />}
					{activeSection === "patients" && <PatientsSection />}
				</div>
			</main>
		</>
	);
}
