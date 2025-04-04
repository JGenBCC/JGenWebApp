"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { firebaseApp } from "../../lib/firebase/clientApp";
import AppLayout from "../components/AppLayout";
import CustomImage from "../../components/CustomImage";

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
}

export default function UserDetails() {
  const searchParams = useSearchParams();
  const userPhone = searchParams.get("phone");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userPhone) return;

      const q = query(collection(db, "users"), where("phone", "==", userPhone));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data() as User);
      } else {
        setUser(null); // Handle case where user is not found
      }
    };

    fetchUser();
  }, [userPhone]);

  if (!user) {
    return <AppLayout pageTitle="User Details"><p>Loading...</p></AppLayout>;
  }

  // Helper function to format date as dd-mm-yyyy
  const formatDOB = (dob: string): string => {
    const date = new Date(dob);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}-${month}-${date.getFullYear()}`;
  };

  return (
    <AppLayout pageTitle={user.displayName}>
      <main>
        <div className="user-details">
          <h1>{user.displayName}</h1>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Date of Birth:</strong> {formatDOB(user.dob)}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Place of Stay:</strong> {user.placeOfStay}</p>
          <p><strong>Education:</strong> {user.education}</p>
          <p><strong>College/Company:</strong> {user.collegeOrCompany}</p>
          <p><strong>User Type:</strong> {user.userType}</p>
          {user.photoURL && (
            <CustomImage
              src={user.photoURL}
              alt={`${user.displayName}'s photo`}
              className="user-photo"
              width={200}
              height={200}
            />
          )}
        </div>
      </main>
    </AppLayout>
  );
}
