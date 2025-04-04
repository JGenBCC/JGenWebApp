"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "../../lib/firebase/clientApp";
import Image from "next/image";
import AppLayout from "../components/AppLayout";
import CustomImage from "../../components/CustomImage";
import { useRouter } from "next/navigation";

const db = getFirestore(firebaseApp);

interface Event {
  docId: string; // Add docId to the Event interface
  eventName: string;
  eventTitle: string;
  eventPosterURL: string;
  eventDate: string;
}

export default function NewEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsList = querySnapshot.docs.map(doc => ({
        docId: doc.id, // Include docId from Firestore
        ...doc.data(),
      } as Event));
      const now = new Date();
      setEvents(eventsList.filter(event => new Date(event.eventDate) > now));
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event: Event) => {
    router.push(`/eventDetails?docId=${encodeURIComponent(event.docId)}`);
  };

  return (
    <AppLayout pageTitle="New Events">
      <main>
        <div className="background-screen new-events-background">
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
