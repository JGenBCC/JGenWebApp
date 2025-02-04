"use client"; 

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from 'react';
import { signInWithGoogle } from '../lib/firebase/auth';

const Home = () => {
  const router = useRouter();
  const message = process.env["MESSAGE"] || "Welcome to J-Gen Youth Group!";

  const handleLogin = async () => {
    try {
      const response = await signInWithGoogle();
      console.log("Login Success:", response);
      router.push("/userList"); // Redirect to the user info page
    } catch (error) {
      console.log("Login Failed:", error);
    }
  };

  return (
    <main className="content">
      <div className="top-right">
        <button onClick={handleLogin} className="google-signin-button">Sign in with Google</button>
      </div>
      <h1 className="heading">J-Gen Youth Group Activities</h1>
      <p>{message}</p>
      <section className="features">
        <article className="card">
          <h2>Add New Member</h2>
          <p>
            Join us for exciting community events and activities. Learn more about our upcoming events{" "}
            <Link href="/addUser">
              <code>/addUser</code>
            </Link>.
          </p>
        </article>
        <article className="card">
          <h2>View Added Members</h2>
          <p>
            Get involved and make a difference! Check out our volunteer opportunities{" "}
            <Link href="/userlist">
              <code>/userlist</code>
            </Link>.
          </p>
        </article>
      </section>
    </main>
  );
};

export default Home;

// Add the following CSS to your stylesheet
/*
.top-right {
  position: absolute;
  top: 10px;
  right: 10px;
}

.google-signin-button {
  // Add your button styling here
}
*/
