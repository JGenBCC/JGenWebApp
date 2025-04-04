"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "../../lib/firebase/clientApp";
import AppLayout from "../components/AppLayout";
import CustomImage from "../../components/CustomImage";

const db = getFirestore(firebaseApp);

interface Event {
  docId: string;
  eventName: string;
  eventTitle: string;
  eventPosterURL: string;
  eventDate: string;
  eventDescription: string;
  eventPlace: string;
  eventChiefGuest: string;
}

export default function EventDetails() {
  const searchParams = useSearchParams();
  const eventDocId = searchParams.get("docId");
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventDocId) return;

      const docRef = doc(db, "events", eventDocId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setEvent({ docId: docSnap.id, ...docSnap.data() } as Event);
      } else {
        setEvent(null);
      }
    };

    fetchEvent();
  }, [eventDocId]);

  if (!event) {
    return <AppLayout pageTitle="Event Details"><p>Loading...</p></AppLayout>;
  }

  return (
    <AppLayout pageTitle={event.eventName}>
      <main>
        <div className="event-details">
          <h1>{event.eventName}</h1>
          <p><strong>Title:</strong> {event.eventTitle}</p>
          <p><strong>Date:</strong> {event.eventDate}</p>
          <p><strong>Place:</strong> {event.eventPlace}</p>
          <p><strong>Chief Guest:</strong> {event.eventChiefGuest}</p>
          <p><strong>Description:</strong> {event.eventDescription}</p>
          {event.eventPosterURL && (
            <CustomImage
              src={event.eventPosterURL}
              alt={`${event.eventTitle} poster`}
              className="event-poster"
              width={400}
              height={400}
            />
          )}
        </div>
      </main>
    </AppLayout>
  );
}
