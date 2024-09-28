import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { Nav } from "../components/Nav";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Amee Example Showcase",
  description:
    "This website highlights verious utilizations of the Amee library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          {/*
           * Keep in mind that when a page uses cookies in Next.js,
           * it will serve a dynamic page rather than static.
           * see https://nextjs.org/docs/app/api-reference/functions/cookies#caveats
           */}
          <header>
            <Nav />
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
