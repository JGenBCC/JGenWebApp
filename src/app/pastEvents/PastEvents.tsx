"use client";

import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "../../lib/firebase/clientApp";
import AppLayout from "../components/AppLayout";
import CustomImage from "../../components/CustomImage";
import { useRouter } from "next/navigation";

const db = getFirestore(firebaseApp);

interface Event {
  docId: string; // Include docId from Firestore
  eventName: string;
  eventTitle: string;
  eventPosterURL: string;
}

export default function PastEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsList = querySnapshot.docs.map(doc => ({
        docId: doc.id, // Include docId from Firestore
        ...doc.data(),
      } as Event));
      setEvents(eventsList);
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event: Event) => {
    router.push(`/eventDetails?docId=${encodeURIComponent(event.docId)}`);
  };

  return (
    <AppLayout pageTitle="Past Events">
      <main className="content past-events-content">
        <div className="background-screen past-events-background">
          <ul className="events-list">
            {events.map((event, index) => (
              <li
                key={index}
                className="event-item"
                onClick={() => handleEventClick(event)}
                style={{ cursor: "pointer" }}
              >
                <p><strong>{event.eventName} :</strong> {event.eventTitle}</p>
                {event.eventPosterURL && (
                  <CustomImage
                    src={event.eventPosterURL}
                    alt={`${event.eventTitle} poster`}
                    className="event-poster"
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