import { Suspense } from "react";
import UserDetails from "./UserDetails";

export default function UserDetailsPage() {
  return (
    <Suspense fallback={<p>Loading user details...</p>}>
      <UserDetails />
    </Suspense>
  );
}
