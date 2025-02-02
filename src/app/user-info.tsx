"use client";

import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
// import { firebaseConfig } from "./config";
import { firebaseConfig } from "../lib/firebase/config";

// Firebase configuration
/*const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};*/

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function UserInfo() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [placeOfStay, setPlaceOfStay] = useState("");
  const [education, setEducation] = useState("");
  const [collegeOrCompany, setCollegeOrCompany] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "users"), {
        name,
        phone,
        dob,
        gender,
        placeOfStay,
        education,
        collegeOrCompany
      });
      console.log("Document successfully written!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  return (
    <main className="content">
      <h1 className="heading">User Information</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Phone Number:
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label>
          Date of Birth:
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
        </label>
        <label>
          Gender:
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>
          Place of Stay in Coimbatore:
          <input type="text" value={placeOfStay} onChange={(e) => setPlaceOfStay(e.target.value)} required />
        </label>
        <label>
          Education / Profession Details:
          <textarea value={education} onChange={(e) => setEducation(e.target.value)} required />
        </label>
        <label>
          College / Company Name:
          <input type="text" value={collegeOrCompany} onChange={(e) => setCollegeOrCompany(e.target.value)} required />
        </label>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
