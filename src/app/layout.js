// src/app/layout.js

import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"; // <-- Import the NEW Toaster from sonner

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tatli Order Slip Generator",
  description: "Offline-first restaurant order slip generator.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-gray-50 antialiased`}
      >
        {children}
        <Toaster position="top-right" duration={12500} />
      </body>
    </html>
  );
}
