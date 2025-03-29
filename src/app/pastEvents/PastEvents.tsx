"use client";

import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "../../lib/firebase/clientApp";
import Image from "next/image";
import AppLayout from "../components/AppLayout";
import CustomImage from "../../components/CustomImage";

const db = getFirestore(firebaseApp);

interface Event {
  eventName: string;
  eventTitle: string;
  eventPosterURL: string;
}

export default function PastEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsList = querySnapshot.docs.map(doc => doc.data() as Event);
      setEvents(eventsList);
    };

    fetchEvents();
  }, []);

  return (
    <AppLayout pageTitle="Past Events">
      <main className="content past-events-content">
        <div className="background-screen past-events-background">
          <ul className="events-list">
            {events.map((event, index) => (
              <li key={index} className="event-item">
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