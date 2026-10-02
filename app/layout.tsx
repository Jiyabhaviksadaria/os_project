import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "📬 ParcelHub — Interactive Producer–Consumer OS Simulator",
  description: "An interactive educational simulation of the Producer-Consumer problem, bounded buffers, mutex locks, semaphores, and process synchronization for Operating Systems coursework.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-navy-950 text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
