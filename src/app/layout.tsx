import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "LankaGeo - Precision SAR Satellite Monitoring",
  description: "Real-time flood analysis system for Sri Lanka using satellite imagery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet" />
      </head>
      <body className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} min-h-full font-sans bg-sys-bg-base flex flex-col`}>
        <UserProvider>
          <Navbar />
          <main className="pt-64 flex-grow">
            {children}
          </main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
