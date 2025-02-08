"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "../../lib/firebase/clientApp"; // Import the firebase app instance
import Image from "next/image";

// ...existing code for Firebase initialization and User interface...

// Initialize Firebase
// const app = initializeApp(firebaseConfig); // REMOVE THIS LINE
const db = getFirestore(firebaseApp);

interface User {
    name: string;
    phone: string;
    dob: string;
    gender: string;
    placeOfStay: string;
    education: string;
    collegeOrCompany: string;
    photo: string | null;
}
  

export default function UserListClient() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map(doc => doc.data() as User);
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  return (
    <main className="content userlist-content-full">
      <div className="background-screen userlist-background">
        <div className="top-right">
        </div>
        <h1 className="heading userlist-heading">User List</h1>
        <ul className="user-list">
          {users.map((user, index) => (
            <li key={index} className="user-item">
              {user.photo && (
                <Image
                  src={user.photo}
                  alt={`${user.name}'s photo`}
                  className="user-photo"
                  width={100}
                  height={100}
                />
              )}
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
