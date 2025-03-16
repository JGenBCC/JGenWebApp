"use client";
import React, { useState } from "react";
import Header from "./Header";

export default function HeaderWrapper({ pageTitle }: { pageTitle: string }) {
	// Sidebar toggle state defined in client component
	const [isSidebarOpen, setSidebarOpen] = useState(false);
	const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

	return <Header pageTitle={pageTitle} isSidebarOpen={isSidebarOpen} onSidebarToggle={toggleSidebar} />;
}
