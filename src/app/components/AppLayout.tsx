"use client";
import React, { useState } from "react";
import Header from "./Header";
import SidebarLayout from "./SidebarLayout";

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export default function AppLayout({ children, pageTitle }: AppLayoutProps) {
  // Set default sidebar state to false so it starts closed
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <>
      <Header pageTitle={pageTitle} isSidebarOpen={isSidebarOpen} onSidebarToggle={toggleSidebar} />
      <SidebarLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
        {children}
      </SidebarLayout>
    </>
  );
}
