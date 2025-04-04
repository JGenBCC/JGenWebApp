"use client";

import Link from "next/link";

interface SidebarLayoutProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  user: { userType: string } | null; // Add user prop
}

export default function SidebarLayout({ children, isSidebarOpen, toggleSidebar, user }: SidebarLayoutProps) {
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "View Added Members", path: "/userlist" },
    { name: "New Events", path: "/newEvents" },
    { name: "Past Events", path: "/pastEvents" },
    { name: "Add An Event", path: "/addEvent" },
    { name: "Enter Attendance", path: "/enterAttendance" },
    { name: "Update User Details", path: "/updateUserDetails" },
  ];

  const filteredMenuItems = user?.userType === "admin"
    ? menuItems // Include all menu items for admin users
    : menuItems.filter(item => item.path !== "/addEvent"); // Exclude "/addEvent" for non-admin users

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
            {filteredMenuItems.map(item => (
              <li key={item.path} style={{ margin: '20px 0' }}>
                <Link href={item.path} style={{ color: '#fff', textDecoration: 'none' }}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div style={{ marginLeft: isSidebarOpen ? '250px' : '0', transition: 'margin-left 0.05s ease' }}>
        {children}
      </div>
    </>
  );
}
