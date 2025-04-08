"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc, collection, setDoc, deleteDoc, QuerySnapshot, query, where, getDocs } from "firebase/firestore"; // Import Firestore query functions
import { firebaseApp } from "../../lib/firebase/clientApp";
import AppLayout from "../components/AppLayout";
import CustomImage from "../../components/CustomImage";
import Switch from "react-switch"; // Import a toggle switch library
import { useAuth } from "../../context/AuthContext"; // Import AuthContext to get user details

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
  isAttendanceOpen: boolean; // New field to track attendance status
}

interface Attendee {
  phoneNumber: string;
  name: string; // Add name field for attendees
}

export default function EventDetails() {
  const searchParams = useSearchParams();
  const eventDocId = searchParams.get("docId");
  const [event, setEvent] = useState<Event | null>(null);
  const [isMarked, setIsMarked] = useState(false); // Track if attendance is marked
  const [attendees, setAttendees] = useState<Attendee[]>([]); // Update state to store attendees with names
  const { user } = useAuth(); // Get user details from AuthContext

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

    const checkAttendance = async () => {
      if (!eventDocId || !user?.phoneNumber) return;

      const phoneNumber = user.phoneNumber.replace("+91", ""); // Extract phone number without +91
      const attendanceDocId = `ev_${eventDocId}_${phoneNumber}`;
      const attendanceRef = doc(db, "attendance", attendanceDocId);
      const attendanceSnap = await getDoc(attendanceRef);

      setIsMarked(attendanceSnap.exists()); // Set attendance status based on Firestore data
    };

    const fetchAttendees = async () => {
      if (!eventDocId) return;

      const attendanceQuery = query(
        collection(db, "attendance"),
        where("eventId", "==", eventDocId)
      );
      const querySnapshot: QuerySnapshot = await getDocs(attendanceQuery);

      const attendeesList = await Promise.all(
        querySnapshot.docs.map(async (attendanceDoc) => {
          const data = attendanceDoc.data();

          // Append +91 to the phone number before querying the users collection
          const userQuery = query(
            collection(db, "users"),
            where("phone", "==", `+91${data.phoneNumber}`)
          );
          const userSnapshot = await getDocs(userQuery);

          const userName =
            !userSnapshot.empty
              ? userSnapshot.docs[0].data().displayName // Get the name from the first matching document
              : "Unknown"; // Default to "Unknown" if no user is found

          return { phoneNumber: data.phoneNumber, name: userName };
        })
      );

      setAttendees(attendeesList); // Update the attendees state
    };

    fetchEvent();
    checkAttendance();
    fetchAttendees();
  }, [eventDocId, user]);

  const toggleAttendance = async (checked: boolean) => {
    if (!event || !event.docId) return;

    const docRef = doc(db, "events", event.docId);

    await updateDoc(docRef, { isAttendanceOpen: checked });
    setEvent((prev) => prev && { ...prev, isAttendanceOpen: checked });
  };

  const markAttendance = async (checked: boolean) => {
    if (!event || !event.docId || !user?.phoneNumber) return;

    const phoneNumber = user.phoneNumber.replace("+91", ""); // Extract phone number without +91
    const attendanceDocId = `ev_${event.docId}_${phoneNumber}`;
    const attendanceRef = doc(collection(db, "attendance"), attendanceDocId);

    if (checked) {
      await setDoc(attendanceRef, {
        eventId: event.docId,
        phoneNumber,
        timestamp: new Date().toISOString(),
      });
      setIsMarked(true);
    } else {
      await deleteDoc(attendanceRef); // Delete the attendance record
      setIsMarked(false);
    }
  };

  // Ensure `event.isAttendanceOpen` is always defined
  const isAttendanceOpen = event?.isAttendanceOpen ?? false;
  const isAdmin = user?.userType === "admin";

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
          {isAttendanceOpen && (
            <div className="attendance-toggle">
              <label>
                <span>Mark Attendance:</span>
                <Switch
                  onChange={markAttendance}
                  checked={isMarked} // Reflect attendance status from Firestore
                  onColor="#86d3ff"
                  offColor="#ccc"
                  checkedIcon={false}
                  uncheckedIcon={false}
                />
              </label>
            </div>
          )}
          {isAdmin && (
            <div className="attendance-toggle">
              <label>
                <span>Open for Attendance:</span>
                <Switch
                  onChange={toggleAttendance}
                  checked={isAttendanceOpen} // Use the default value
                  onColor="#86d3ff"
                  offColor="#ccc"
                  checkedIcon={false}
                  uncheckedIcon={false}
                />
              </label>
            </div>
          )}
          {isAdmin && attendees.length > 0 && (
            <div className="attendees-list">
              <h2>Attendees</h2>
              <ul>
                {attendees.map((attendee, index) => (
                  <li key={index}>
                    <a href={`/userDetails?phone=${encodeURIComponent(`+91${attendee.phoneNumber}`)}`}>
                      {attendee.name} ({attendee.phoneNumber})
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
