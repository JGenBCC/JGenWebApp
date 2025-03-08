"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../context/AuthContext";
import Image from 'next/image';

const Home = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const message = process.env["MESSAGE"] || "Welcome to J-Gen Youth Group!";
  const { user, logout, loginWithPhone, signInLoading } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

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
          justifyContent: 'flex-start', // Ensures content is left-aligned
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
        <main className="content" style={{ padding: '20px' }}>
          <div className="top-right">
            {user ? (
              <div>
                <h2>Welcome, {user.displayName || user.phoneNumber.replace('+91', '')}!</h2>
                {user.photoURL ? (
                  <Image src={user.photoURL} alt="Profile" width={50} height={50} style={{ borderRadius: "50%" }} />
                ) : null}
                <p>Ph: {user.phoneNumber.replace('+91', '')}</p>
                <button onClick={logout} style={{ padding: "10px 20px", fontSize: "16px" }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <div>
                <button onClick={loginWithPhone} className="button" disabled={signInLoading}>
                  {signInLoading ? "Signing in..." : "Sign in with Phone"}
                </button>
              </div>
            )}
          </div>
          <h1 className="heading">J-Gen Youth Group Activities</h1>
          <p>{message}</p>
          <section className="features" style={{ display: 'flex', gap: '20px' }}>
            <article className="card">
              <h2>Add New Member</h2>
              <p>
                Join us for exciting community events and activities. Add your profile details here{" "}
                <Link href="/addUser">
                  <code>/addUser</code>
                </Link>.
              </p>
            </article>
            <article className="card">
              <h2>View Added Members</h2>
              <p>
                Get involved and make a difference! Check out our existing profiles{" "}
                <Link href="/userlist">
                  <code>/userlist</code>
                </Link>.
              </p>
            </article>
          </section>
          {/* Recaptcha container required for phone auth */}
          <div id="recaptcha-container"></div>
          <ToastContainer />
        </main>
      </div>
    </div>
  );
};

export default Home;
