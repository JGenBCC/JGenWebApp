"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, where, documentId } from "firebase/firestore";
import { firebaseApp } from "../../lib/firebase/clientApp"; // Import the firebase app instance
import Image from "next/image";
import { useAuth } from "../../context/AuthContext"; // new import
import AppLayout from "../components/AppLayout";
import CustomImage from "../../components/CustomImage";
import { useRouter } from "next/navigation";

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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // New state for filtered users
  const [genderFilter, setGenderFilter] = useState<string>(""); // New state for gender filter
  const [userTypeFilter, setUserTypeFilter] = useState<string>(""); // New state for user type filter
  const { user, loading } = useAuth(); // using current user from AuthProvider
  const router = useRouter();

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
        // Regular user gets all users of the same gender
        const q = query(collection(db, "users"), where("gender", "==", user.gender));
        const querySnapshot = await getDocs(q);
        usersList = querySnapshot.docs.map(doc => doc.data() as User);
      }

      setUsers(usersList);
      setFilteredUsers(usersList); // Initialize filtered users with the full list
    };

    fetchUsers();
  }, [user, loading]);

  useEffect(() => {
    // Apply gender and user type filters locally
    let filtered = [...users];
    if (genderFilter) {
      filtered = filtered.filter(user => user.gender === genderFilter);
    }
    if (userTypeFilter) {
      filtered = filtered.filter(user => user.userType === userTypeFilter);
    }

    // Sort users by their displayName
    filtered.sort((a, b) => a.displayName.localeCompare(b.displayName));

    setFilteredUsers(filtered);
  }, [genderFilter, userTypeFilter, users]);

  const handleUserClick = (userPhone: string) => {
    router.push(`/userDetails?phone=${encodeURIComponent(userPhone)}`);
  };

  return (
    <AppLayout pageTitle="Added Members">
      <main className="content userlist-content-full">
        <div className="background-screen userlist-background">
          {user?.userType === "admin" && ( // Show filters only for admin users
            <div className="top-right">
              <label htmlFor="gender-filter" style={{ marginRight: "8px" }}>Gender:</label>
              <select
                id="gender-filter"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="gender-filter-dropdown"
              >
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label htmlFor="user-type-filter" style={{ marginLeft: "16px", marginRight: "8px" }}>User Type:</label>
              <select
                id="user-type-filter"
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
                className="user-type-filter-dropdown"
              >
                <option value="">All</option>
                <option value="admin">Admin</option>
                <option value="coord">Coord</option>
                <option value="regular">Regular User</option>
              </select>
            </div>
          )}
          <ul className="user-list">
            {filteredUsers.map((user, index) => (
              <li
                key={index}
                className="user-item"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", cursor: "pointer" }}
                onClick={() => handleUserClick(user.phone)}
              >
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
                    <CustomImage
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
    </AppLayout>
  );
}
