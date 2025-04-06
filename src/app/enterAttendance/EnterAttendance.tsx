"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "../../lib/firebase/clientApp";
import Image from "next/image";
import AppLayout from "../components/AppLayout";
import { useRouter } from "next/navigation";

const db = getFirestore(firebaseApp);

interface Event {
  eventName: string;
  eventTitle: string;
  eventPosterURL: string;
  eventDate: string;
  isAttendanceOpen: boolean; // New field to track attendance status
  docId: string; // Document ID from Firestore
}

export default function EnterAttendance() {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOpenAttendanceEvents = async () => {
      const eventsCollection = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsCollection);
      const openEvents = eventsSnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            eventName: data.eventName || "",
            eventTitle: data.eventTitle || "",
            eventPosterURL: data.eventPosterURL || "",
            eventDate: data.eventDate || "",
            isAttendanceOpen: data.isAttendanceOpen || false,
            docId: doc.id,
          } as Event;
        })
        .filter((event) => event.isAttendanceOpen);

      setEvents(openEvents);
    };

    fetchOpenAttendanceEvents();
  }, []);

  const handleEventClick = (event: Event) => {
    router.push(`/eventDetails?docId=${encodeURIComponent(event.docId)}`);
  };

  return (
    <AppLayout pageTitle="Enter Attendance">
      <main>
        <div className="background-screen new-events-background">
          <h1>Events Open for Attendance</h1>
          <ul>
            {events.map((event) => (
              <li
                key={event.eventName}
                onClick={() => handleEventClick(event)}
                style={{ cursor: "pointer" }}
              >
                <h2>{event.eventName}</h2>
                <p><strong>Title:</strong> {event.eventTitle}</p>
                <p><strong>Date:</strong> {event.eventDate}</p>
                {event.eventPosterURL && (
                  <Image
                    src={event.eventPosterURL}
                    alt={`${event.eventTitle} poster`}
                    width={200}
                    height={200}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </AppLayout>
  );
}
