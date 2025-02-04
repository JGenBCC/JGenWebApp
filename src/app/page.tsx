"use client";

import { useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from 'react';
import { signInWithGoogle, handleRedirectResult } from '../lib/firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../context/AuthContext";
import Image from 'next/image'; // Import Image component

const Home = () => {
  const router = useRouter();
  const message = process.env["MESSAGE"] || "Welcome to J-Gen Youth Group!";
  const { user, login, logout } = useAuth();

  return (
    <main className="content">
      <div className="top-right">
        {user ? (
          <div>
            <h2>Welcome, {user.displayName}!</h2>
            <Image src={user.photoURL} alt="Profile" width={100} height={100} style={{ borderRadius: "50%" }} /> {/* Use Image component */}
            <p>Email: {user.email}</p>
            <button onClick={logout} style={{ padding: "10px 20px", fontSize: "16px" }}>
              Sign Out
            </button>
          </div>
        ) : (
          <button onClick={login} className="google-signin-button">Sign in with Google</button>
        )}
      </div>
      <h1 className="heading">J-Gen Youth Group Activities</h1>
      <p>{message}</p>
      <section className="features">
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
      <ToastContainer />
    </main>
  );
};

export default Home;

