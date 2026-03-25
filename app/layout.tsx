import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hormuz - Geopolitical Crisis Simulation",
  description: "Navigate an Iranian nuclear crisis as the U.S. President in this realistic turn-based strategy game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
