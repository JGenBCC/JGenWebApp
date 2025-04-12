"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseApp } from "../../lib/firebase/clientApp";
import AppLayout from "../components/AppLayout";
import CustomImage from "../../components/CustomImage";
import { useAuth } from "../../context/AuthContext"; // Import AuthContext to get logged-in user details

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
  assignedCoord?: string; // Add field to store assigned coordinator
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
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the logged-in user is an admin
  const [newUserType, setNewUserType] = useState(user?.userType || ""); // State to store the selected user type
  const { user: loggedInUser } = useAuth(); // Get logged-in user details from AuthContext
  const [coords, setCoords] = useState<User[]>([]); // State to store list of coordinators
  const [selectedCoord, setSelectedCoord] = useState(user?.assignedCoord || ""); // State for selected coordinator
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]); // State to store users assigned to the coordinator

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

    const checkAdmin = () => {
      setIsAdmin(loggedInUser?.userType === "admin"); // Check if the logged-in user is an admin
    };

    const fetchCoords = async () => {
      const q = query(collection(db, "users"), where("userType", "==", "coord")); // Fetch coordinators
      const querySnapshot = await getDocs(q);
      const coordList = querySnapshot.docs.map((doc) => doc.data() as User);
      setCoords(coordList);
    };

    const fetchAssignedUsers = async () => {
      if (user?.userType === "coord") {
        const q = query(collection(db, "users"), where("assignedCoord", "==", user.phone)); // Fetch users assigned to this coordinator
        const querySnapshot = await getDocs(q);
        const usersList = querySnapshot.docs.map((doc) => doc.data() as User);
        setAssignedUsers(usersList);
      }
    };

    fetchUser();
    fetchAttendedEvents();
    checkAdmin();
    fetchCoords();
    fetchAssignedUsers();
  }, [userPhone, loggedInUser, user]);

  // Function to handle user type update
  const updateUserType = async () => {
    if (!user || !newUserType) return;

    const userQuery = query(collection(db, "users"), where("phone", "==", user.phone));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDocRef = querySnapshot.docs[0].ref;
      await updateDoc(userDocRef, { userType: newUserType });
      setUser((prev) => prev && { ...prev, userType: newUserType }); // Update local state
      alert("User type updated successfully!");
    }
  };

  // Function to handle coordinator assignment
  const assignCoord = async () => {
    if (!user || !selectedCoord) return;

    const userQuery = query(collection(db, "users"), where("phone", "==", user.phone));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDocRef = querySnapshot.docs[0].ref;
      await updateDoc(userDocRef, { assignedCoord: selectedCoord });
      setUser((prev) => prev && { ...prev, assignedCoord: selectedCoord }); // Update local state
      alert("Coordinator assigned successfully!");
    }
  };

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
    <AppLayout pageTitle="User Details">
      <main>
        <div className="user-details">
          <h1>{user.displayName}</h1>
          <p>
            <strong>Phone:</strong>{" "}
            {navigator.userAgent.toLowerCase().includes("android") ? (
              <a href={`tel:${user.phone}`}>{user.phone}</a>
            ) : (
              user.phone
            )}
          </p>
          <p><strong>Date of Birth:</strong> {formatDOB(user.dob)}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Place of Stay:</strong> {user.placeOfStay}</p>
          <p><strong>Education:</strong> {user.education}</p>
          <p><strong>College/Company:</strong> {user.collegeOrCompany}</p>
          <p><strong>User Type:</strong> {user.userType}</p>
          {user.assignedCoord && (
            <p>
              <strong>Assigned Coordinator:</strong>{" "}
              {coords.find(coord => coord.phone === user.assignedCoord) ? (
                <a href={`/userDetails?phone=${encodeURIComponent(user.assignedCoord)}`}>
                  {coords.find(coord => coord.phone === user.assignedCoord)?.displayName}
                </a>
              ) : (
                "Unknown"
              )}
            </p>
          )}
          {user.photoURL && (
            <CustomImage
              src={user.photoURL}
              alt={`${user.displayName}'s photo`}
              className="user-photo"
              width={200}
              height={200}
            />
          )}
          {isAdmin && (
            <div className="user-type-update">
              <h3>Change User Type</h3>
              <select
                value={newUserType || user.userType} // Ensure the dropdown reflects the current user type
                onChange={(e) => setNewUserType(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="coord">Coordinator</option>
                <option value="regular">Regular User</option>
              </select>
              <button onClick={updateUserType}>Update</button>
            </div>
          )}
          {(isAdmin || loggedInUser?.userType === "coord") ? (
            user.userType === "regular" && (
              <div className="assign-coord">
                <h3>Assign Coordinator</h3>
                <select
                  value={selectedCoord || user.assignedCoord || ""}
                  onChange={(e) => setSelectedCoord(e.target.value)}
                >
                  <option value="" disabled>Select a Coordinator</option>
                  {coords.map((coord) => (
                    <option key={coord.phone} value={coord.phone}>
                      {coord.displayName}
                    </option>
                  ))}
                </select>
                <button onClick={assignCoord}>Assign</button>
              </div>
            )
          ) : null}
          {user.userType === "coord" && assignedUsers.length > 0 && (
            <div className="assigned-users">
              <h3>Group Users:</h3>
              <ul>
                {assignedUsers.map((assignedUser) => (
                  <li key={assignedUser.phone}>
                    <a href={`/userDetails?phone=${encodeURIComponent(assignedUser.phone)}`}>
                      {assignedUser.displayName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
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
