"use client";

import React from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../context/AuthContext";
import Image from 'next/image';
import SidebarLayout from "./components/SidebarLayout";

// ...existing code removed: local isSidebarOpen, toggleSidebar and duplicate sidebar markup...

const Home = () => {
  const router = useRouter();
  const message = process.env["MESSAGE"] || "Welcome to J-Gen Youth Group!";
  const { user, logout, loginWithPhone, signInLoading } = useAuth();

  return (
    <SidebarLayout>
      {/* Main Content Only */}
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
              <Link href="/addUser"><code>/addUser</code></Link>.
            </p>
          </article>
          <article className="card">
            <h2>View Added Members</h2>
            <p>
              Get involved and make a difference! Check out our existing profiles{" "}
              <Link href="/userlist"><code>/userlist</code></Link>.
            </p>
          </article>
        </section>
        {/* Recaptcha container required for phone auth */}
        <div id="recaptcha-container"></div>
        <ToastContainer />
      </main>
    </SidebarLayout>
  );
};

export default Home;
