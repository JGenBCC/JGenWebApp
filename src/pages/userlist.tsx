"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../lib/firebase/config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map(doc => doc.data());
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  return (
    <main className="content" style={{ backgroundImage: 'url("/path/to/background-image.jpg")', backgroundSize: 'cover' }}>
      <div className="background-screen">
        <h1 className="heading">User List</h1>
        <ul className="user-list">
          {users.map((user, index) => (
            <li key={index} className="user-item">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Date of Birth:</strong> {user.dob}</p>
              <p><strong>Gender:</strong> {user.gender}</p>
              <p><strong>Place of Stay:</strong> {user.placeOfStay}</p>
              <p><strong>Education:</strong> {user.education}</p>
              <p><strong>College/Company:</strong> {user.collegeOrCompany}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
