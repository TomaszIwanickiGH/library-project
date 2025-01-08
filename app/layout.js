"use client";

import { SessionProvider } from "next-auth/react";

import "./globals.css";
import Navbar from "./components/Navbar";
import BooksSection from "./components/BooksSection";
import LoginModal from "./modals/LoginModal";
import RegisterModal from "./modals/RegisterModal";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          <LoginModal />
          <RegisterModal />
        {children}
        </SessionProvider>
      </body>
    </html>
  );
}
