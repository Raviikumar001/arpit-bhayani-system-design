import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arpit Bhayani Learning Hub",
  description: "Unofficial Learning Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen bg-black text-zinc-100`}
      >
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden mb-16 md:mb-0">
          <main className="flex-1">
            {children}
          </main>
          {/* <Footer /> */}
        </div>
        <MobileNav />
        <Analytics />
      </body>
    </html>
  );
}
