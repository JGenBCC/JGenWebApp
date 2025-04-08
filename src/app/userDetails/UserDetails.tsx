"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
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

interface Event {
  eventId: string;
  eventName: string;
  eventDate: string; // Add eventDate to include event timings
}

export default function UserDetails() {
  const searchParams = useSearchParams();
  const userPhone = searchParams.get("phone");
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]); // State to store attended events

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

    const fetchAttendedEvents = async () => {
      if (!userPhone) return;

      const attendanceQuery = query(
        collection(db, "attendance"),
        where("phoneNumber", "==", userPhone.replace("+91", "")) // Match attendance records by phone number
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);

      const eventsList = await Promise.all(
        attendanceSnapshot.docs.map(async (attendanceDoc) => {
          const data = attendanceDoc.data();
          const eventRef = doc(db, "events", data.eventId);
          const eventSnap = await getDoc(eventRef);

          if (eventSnap.exists()) {
            const eventData = eventSnap.data();
            return { eventId: data.eventId, eventName: eventData.eventName, eventDate: eventData.eventDate };
          }
          return null;
        })
      );

      setEvents(eventsList.filter((event) => event !== null) as Event[]); // Filter out null values
    };

    fetchUser();
    fetchAttendedEvents();
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

  // Helper function to format event date as "dd-mm-yyyy hh:mm AM/PM"
  const formatEventDate = (eventDate: string): string => {
    const date = new Date(eventDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${period}`;
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
          {events.length > 0 && (
            <div className="attended-events">
              <h2>Attended Events</h2>
              <ul>
                {events.map((event) => (
                  <li key={event.eventId}>
                    <a href={`/eventDetails?docId=${event.eventId}`}>
                      {event.eventName} - {formatEventDate(event.eventDate)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  );
}
