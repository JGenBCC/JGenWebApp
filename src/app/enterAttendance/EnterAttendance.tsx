"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "../../lib/firebase/clientApp";
import Image from "next/image";
import AppLayout from "../components/AppLayout";

const db = getFirestore(firebaseApp);

interface Event {
  eventName: string;
  eventTitle: string;
  eventPosterURL: string;
  eventDate: string;
}

export default function EnterAttendance() {


  return (
    <AppLayout pageTitle="Enter Attendance">
      <main>
        <div className="background-screen new-events-background">
          
        </div>
      </main>
    </AppLayout>
  );
}
