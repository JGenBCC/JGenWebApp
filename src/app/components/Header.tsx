"use client";
import React from "react";
import { useAuth } from "../../context/AuthContext"; // new import
import Link from "next/link"; // new import
import Image from "next/image";

interface HeaderProps {
    pageTitle: string;
    onSidebarToggle: () => void;
    isSidebarOpen: boolean;
}

export default function Header({ pageTitle, onSidebarToggle, isSidebarOpen }: HeaderProps) {
    const { user } = useAuth(); // get user from context
    const userPhoto = user?.photoURL || "/default-user.png"; // use user's photoURL

    return (
        <>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '60px',
                backgroundColor: '#f1f1f1',
                padding: '0 20px',
                position: 'relative', // add positioning context
                zIndex: 1100 // ensure header appears over the sidebar
            }}>
                {/* Left - Sidebar toggle */}
                <div>
                    <button
                        onClick={onSidebarToggle}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer'
                        }}
                        aria-label="Toggle sidebar"
                    >
                        {isSidebarOpen ? <>&times;</> : <>&#9776;</>}
                    </button>
                </div>
                {/* Center - Page title */}
                <div>
                    <h1 style={{ margin: 0 }}>{pageTitle}</h1>
                </div>
                {/* Right - User photo */}
                <div>
                    <Link href="/updateUserDetails">
                        <Image 
                            crossOrigin="anonymous" // added to enable cross-origin requests
                            src={userPhoto}
                            alt="User"
                            width={40}
                            height={40}
                            style={{
                                borderRadius: "50%",
                                cursor: "pointer"
                            }}
                        />
                    </Link>
                </div>
            </div>
        </>
    );
}