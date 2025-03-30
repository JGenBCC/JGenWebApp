"use client";

import React from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../context/AuthContext";
import Image from 'next/image';
import AppLayout from "./components/AppLayout";

const Home = () => {
  const router = useRouter();
  const message = process.env["MESSAGE"] || "Welcome to J-Gen Youth Group!";
  const { user, logout, loginWithPhone, signInLoading } = useAuth();

  return (
    <AppLayout pageTitle="J-Gen">
      <main className="content" style={{ padding: '20px' }}>
        <h1 className="heading">J-Gen Youth Group Activities</h1>
        <div style={{ textAlign: 'center' }}>
          {user ? (
            <div>
              <h2 style={{ marginBottom: '10px' }}>
                Welcome, {user.displayName || user.phoneNumber.replace('+91', '')}!
              </h2>
              <p style={{ marginBottom: '10px' }}>
                Ph: {user.phoneNumber.replace('+91', '')}
              </p>
              {(user.userType === 'admin' || user.userType === 'coord') && (
                <p style={{ marginBottom: '10px' }}>
                  User Type: {user.userType}
                </p>
              )}
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
        <p>{message}</p>
        <section className="features" style={{ display: 'flex', gap: '20px' }}>
          <article className="card">
            <h2>View New Events</h2>
            <p>
              Join us for exciting community events and activities. See the new events at J-Gen{" "}
              <Link href="/newEvents"><code>/newEvents</code></Link>.
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
        <div id="recaptcha-container"></div>
        <ToastContainer />
      </main>
    </AppLayout>
  );
};

export default Home;
