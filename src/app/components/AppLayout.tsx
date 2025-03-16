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
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Header pageTitle={pageTitle} isSidebarOpen={isSidebarOpen} onSidebarToggle={toggleSidebar} />
      </div>
      <div style={{ marginTop: "60px" }}>
        <SidebarLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
          {children}
        </SidebarLayout>
      </div>
    </>
  );
}
