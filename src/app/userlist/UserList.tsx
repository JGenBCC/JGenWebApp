"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, where, documentId } from "firebase/firestore";
import { firebaseApp } from "../../lib/firebase/clientApp"; // Import the firebase app instance
import Image from "next/image";
import { useAuth } from "../../context/AuthContext"; // new import

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
    userType: string;
    coordDocId: string;
    userDocId: string;
}

export default function UserListClient() {
  const [users, setUsers] = useState<User[]>([]);
  const { user, loading } = useAuth(); // using current user from AuthProvider

  useEffect(() => {
    if (loading || !user) return; // Wait for user info

    const fetchUsers = async () => {
      let usersList: User[] = [];
      if (user.userType === "admin") {
        // Admin gets all users
        const querySnapshot = await getDocs(collection(db, "users"));
        usersList = querySnapshot.docs.map(doc => doc.data() as User);
      } else if (user.userType === "coord") {
        // Coord gets his own document and users where coordDocId equals his userDocId
        const ownQuery = query(collection(db, "users"), where(documentId(), "==", user.userDocId));
        const coordQuery = query(collection(db, "users"), where("coordDocId", "==", user.userDocId));
        
        const [ownSnapshot, coordSnapshot] = await Promise.all([
          getDocs(ownQuery),
          getDocs(coordQuery)
        ]);
        
        const ownUsers = ownSnapshot.docs.map(doc => doc.data() as User);
        const coordUsers = coordSnapshot.docs.map(doc => doc.data() as User);
        // Merge and remove duplicates based on a unique identifier (userDocId)
        const merged = [...ownUsers, ...coordUsers];
        const uniqueUsers = Array.from(new Map(merged.map(u => [u.phone, u])).values());
        usersList = uniqueUsers;
      } else {
        // Regular user gets only their own document (using documentId)
        const q = query(collection(db, "users"), where(documentId(), "==", user.userDocId));
        const querySnapshot = await getDocs(q);
        usersList = querySnapshot.docs.map(doc => doc.data() as User);
      }
      setUsers(usersList);
    };

    fetchUsers();
  }, [user, loading]);

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
