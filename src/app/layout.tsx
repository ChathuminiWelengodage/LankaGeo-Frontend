import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import Navbar from "@/components/layout/Navbar";

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
    <html lang="en" className="h-full antialiased">
      <body className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} min-h-full font-sans bg-sys-bg-base`}>
        <UserProvider>
          <Navbar />
          <div className="pt-64">
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
