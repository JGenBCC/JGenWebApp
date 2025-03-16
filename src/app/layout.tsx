import type { Metadata } from "next";
import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css";
import AppLayout from "./components/AppLayout"; // Updated import

export const metadata: Metadata = {
  title: "J-Gen",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
            {children}
          <div className="bottom-gradient" />
        </AuthProvider>
      </body>
    </html>
  );
}
