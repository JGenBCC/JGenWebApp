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
    displayName: string;
    phone: string;
    dob: string;
    gender: string;
    placeOfStay: string;
    education: string;
    collegeOrCompany: string;
    photoURL: string | null;
    userType: string;
    coordDocId: string;
    userDocId: string;
}

export default function UserListClient() {
  const [users, setUsers] = useState<User[]>([]);
  const { user, loading } = useAuth(); // using current user from AuthProvider

  // Helper function to format date as dd-mm-yyyy
  function formatDOB(dob: string): string {
    const date = new Date(dob);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}-${month}-${date.getFullYear()}`;
  }

  useEffect(() => {
    if (loading || !user || !user.userDocId) return; // Wait for user info

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
        <h1 className="heading userlist-heading" style={{ marginBottom: "1rem" }}>Users List</h1>
        <ul className="user-list">
          {users.map((user, index) => (
            <li key={index} className="user-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div className="user-details">
                <p><strong>{index + 1}: {user.displayName}</strong></p>
                <p>{user.phone.startsWith("+91") ? user.phone.slice(3) : user.phone}</p>
                <p>{formatDOB(user.dob)}</p>
                <p>{user.placeOfStay}</p>
                <p>{user.education}</p>
                <p>{user.collegeOrCompany}</p>
              </div>
              {user.photoURL && (
                <div className="user-photo-container">
                  <Image
                    src={user.photoURL}
                    alt={`${user.displayName}'s photo`}
                    className="user-photo"
                    width={100}
                    height={100}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
