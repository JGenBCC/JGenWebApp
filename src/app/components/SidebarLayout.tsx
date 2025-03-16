"use client";

import { useState } from "react";
import Link from "next/link";

interface SidebarLayoutProps {
	children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar Navigation */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: isSidebarOpen ? 0 : '-250px',
          height: '100%',
          width: '250px',
          backgroundColor: '#111',
          color: '#fff',
          transition: 'left 0.3s ease',
          paddingTop: '20px',
          zIndex: 1000,
        }}
      >
        <button
          onClick={toggleSidebar}
          style={{
            marginLeft: '200px',
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '30px',
            cursor: 'pointer'
          }}
          aria-label="Close sidebar"
        >
          &times;
        </button>
        <nav style={{ padding: '20px' }}>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ margin: '20px 0' }}>
              <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>
                Home
              </Link>
            </li>
            <li style={{ margin: '20px 0' }}>
              <Link href="/userlist" style={{ color: '#fff', textDecoration: 'none' }}>
                View Added Members
              </Link>
            </li>
            <li style={{ margin: '20px 0' }}>
              <Link href="/newEvents" style={{ color: '#fff', textDecoration: 'none' }}>
                New Events
              </Link>
            </li>
            <li style={{ margin: '20px 0' }}>
              <Link href="/pastEvents" style={{ color: '#fff', textDecoration: 'none' }}>
                Past Events
              </Link>
            </li>
            <li style={{ margin: '20px 0' }}>
              <Link href="/enterAttendence" style={{ color: '#fff', textDecoration: 'none' }}>
                Enter Attendence
              </Link>
            </li>
            <li style={{ margin: '20px 0' }}>
              <Link href="/updateUserDetails" style={{ color: '#fff', textDecoration: 'none' }}>
                Update User Details
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: isSidebarOpen ? '250px' : '0', transition: 'margin-left 0.05s ease', width: '100%' }}>
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '10px',
            background: '#f1f1f1'
          }}
        >
          <button
            onClick={toggleSidebar}
            style={{
              fontSize: '24px',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            aria-label="Open sidebar"
          >
            &#9776;
          </button>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
