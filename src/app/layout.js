import "./globals.css";
import { GeistSans } from "geist/font/sans"; // Using Vercel's Geist font as suggested

export const metadata = {
  title: "Tatli Order Slip Generator MVP",
  description: "Offline-first restaurant order slip generator.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Use GeistSans class for clean, modern typography */}
      <body
        className={`${GeistSans.className} min-h-screen bg-gray-50 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
