"use client";

import { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../lib/firebase/clientApp";
import AppLayout from "../components/AppLayout";
import { compressImage } from "../utils";

// Utility functions for slugification
function slugify(text: string) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')  // Replace non-alphanumerics with _
    .replace(/^_+|_+$/g, '')      // Trim underscores at start/end
    .replace(/_+/g, '_');         // Remove duplicate underscores
}

// Updated format function to use dd-mm-yyyy_hh-min format
function formatEventTime(dateStr: string) {
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy}_${hh}-${min}`;
}

export default function AddEventForm() {
    // Changed states for event
    const [eventName, setEventName] = useState("");
    const [eventTitle, setEventTitle] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventPlace, setEventPlace] = useState("");
    const [eventChiefGuest, setEventChiefGuest] = useState("");
    const [eventPoster, setEventPoster] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        let eventPosterURL = null;
        if (eventPoster) {
            const storageRef = ref(storage, `EventPosters/${eventTitle}`);
            const compressedImage = await compressImage(eventPoster);
            await uploadBytes(storageRef, compressedImage);
            eventPosterURL = await getDownloadURL(storageRef);
        }
        // Generate sluggified event docId
        // Example: For eventName "Youth Worship Night" and eventDate "2025-04-10T18:30:00",
        // the resulting eventId will be "youth_worship_night_10-04-2025_18-30"
        const eventId = `ev_${slugify(eventName)}_${formatEventTime(eventDate)}`;
        await setDoc(doc(db, "events", eventId), {
          eventName,
          eventTitle,
          eventDate,
          eventPlace,
          eventChiefGuest,
          eventPosterURL
        });
        console.log("Event successfully created!");
        // Clear form fields
        setEventName("");
        setEventTitle("");
        setEventDate("");
        setEventPlace("");
        setEventChiefGuest("");
        setEventPoster(null);
      } catch (error) {
        console.error("Error creating event: ", error);
      }
    };

    return (
        <div lang="en" className="light-theme">
            <AppLayout pageTitle="Add An Event">
            <main className="content">
                <div className="background-screen">
                    <form onSubmit={handleSubmit} className="user-form">
                        <label className="form-field">
                            Event Name:
                            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                            <br /><br /><br />
                        </label>
                        <label className="form-field">
                            Event Title:
                            <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required />
                            <br /><br /><br />
                        </label>
                        <label className="form-field">
                            Event Date & Time:
                            <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
                            <br /><br /><br />
                        </label>
                        <label className="form-field">
                            Event Place:
                            <input type="text" value={eventPlace} onChange={(e) => setEventPlace(e.target.value)} required />
                            <br /><br /><br />
                        </label>
                        <label className="form-field">
                            Chief Guest:
                            <input type="text" value={eventChiefGuest} onChange={(e) => setEventChiefGuest(e.target.value)} required />
                            <br /><br /><br />
                        </label>
                        <label className="form-field">
                            Event Poster:
                            <input type="file" onChange={(e) => setEventPoster(e.target.files ? e.target.files[0] : null)} required />
                            <br /><br /><br />
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div className="bottom-gradient" />
            </main>
            </AppLayout>
        </div>
    );
}
