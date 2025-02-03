"use client";

import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../lib/firebase/config";
import { Header } from "../app/components"; // Adjust the import path as necessary

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
    <div lang="en" className="light-theme">
      <main className="content" style={{ backgroundImage: 'url("/path/to/background-image.jpg")', backgroundSize: 'cover' }}>
        <div className="dots" />
        <Header />
        <div className="background-screen">
          <h1 className="heading">User Information</h1>
          <form onSubmit={handleSubmit} className="user-form">
            <label className="form-field">
              Name:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              <br /><br /><br />
            </label>
            <label className="form-field">
              Phone Number:
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <br /><br /><br />
            </label>
            <label className="form-field">
              Date of Birth:
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
              <br /><br /><br />
            </label>
            <label className="form-field">
              Gender:
              <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <br /><br /><br />
            </label>
            <label className="form-field">
              Place of Stay in Coimbatore:
              <input type="text" value={placeOfStay} onChange={(e) => setPlaceOfStay(e.target.value)} required />
              <br /><br /><br />
            </label>
            <label className="form-field">
              Education / Profession Details:
              <textarea value={education} onChange={(e) => setEducation(e.target.value)} required />
              <br /><br /><br />
            </label>
            <label className="form-field">
              College / Company Name:
              <input type="text" value={collegeOrCompany} onChange={(e) => setCollegeOrCompany(e.target.value)} required />
              <br /><br /><br />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="bottom-gradient" />
      </main>
    </div>
  );
}
