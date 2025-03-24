"use client";

import Link from "next/link";

interface SidebarLayoutProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function SidebarLayout({ children, isSidebarOpen, toggleSidebar }: SidebarLayoutProps) {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '250px',
          backgroundColor: '#111',
          color: '#fff',
          transition: 'transform 0.3s ease',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          zIndex: 3000,
          opacity: 1,
        }}
      >
        <button
          onClick={toggleSidebar}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
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
              <Link href="/addEvent" style={{ color: '#fff', textDecoration: 'none' }}>
                Add An Event
              </Link>
            </li>
            <li style={{ margin: '20px 0' }}>
              <Link href="/enterAttendance" style={{ color: '#fff', textDecoration: 'none' }}>
                Enter Attendance
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
      <div style={{ marginLeft: isSidebarOpen ? '250px' : '0', transition: 'margin-left 0.05s ease' }}>
        {children}
      </div>
    </>
  );
}
