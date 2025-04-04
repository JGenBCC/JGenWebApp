"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header";
import SidebarLayout from "./SidebarLayout";

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export default function AppLayout({ children, pageTitle }: AppLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Use usePathname to get the current path

  useEffect(() => {
    if (!loading) {
      if (user === undefined) {
        // Wait until the user state is fully initialized
        return;
      }
      if (user && user.userDocId && !user.isProfileComplete) {
        router.push("/updateUserDetails");
      } else if (!user) {
        router.push("/");
      } else if (pathname === "/addEvent" && user.userType !== "admin") {
        // Redirect non-admin users away from the addEvent page
        router.push("/");
      }
    }
  }, [loading, user, router, pathname]); // Add pathname to dependencies

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Header pageTitle={pageTitle} isSidebarOpen={isSidebarOpen} onSidebarToggle={toggleSidebar} />
      </div>
      <div style={{ marginTop: "60px" }}>
        <SidebarLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} user={user}>
          {children}
        </SidebarLayout>
      </div>
    </>
  );
}
