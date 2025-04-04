"use client";

import { Suspense } from "react";
import EventDetails from "./EventDetails";

export default function EventDetailsPage() {
  return (
    <Suspense fallback={<p>Loading event details...</p>}>
      <EventDetails />
    </Suspense>
  );
}
