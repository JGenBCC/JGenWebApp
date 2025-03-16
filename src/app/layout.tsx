import type { Metadata } from "next";
import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css";
import HeaderWrapper from "./components/HeaderWrapper"; // Updated import

export const metadata: Metadata = {
  title: "J-Gen",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Define a toggle handler for the header button
  const toggleSidebar = () => {
    // ...existing sidebar toggle logic or placeholder...
    console.log("Toggle sidebar");
  };

  return (
    <html lang="en" className="light-theme">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <div className="dots" />
          <HeaderWrapper pageTitle="My Page Title" />
          {children}
          <div className="bottom-gradient" />
        </AuthProvider>
      </body>
    </html>
  );
}
