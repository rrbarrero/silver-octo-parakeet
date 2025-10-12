import type { Metadata } from "next";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobHaunt | Application Tracker",
  description: "Track job applications with a DDD and CQRS powered workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable}`}
        >
          <header className="flex items-center justify-between px-6 py-4 text-sm text-slate-600 dark:text-slate-200">
            <Link href="/" className="font-semibold tracking-wide">
              JobHaunt
            </Link>
            <nav className="flex items-center gap-3">
              <SignedOut>
                <SignInButton mode="modal" appearance={{ elements: { button: "rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-semibold" } }} />
                <SignUpButton mode="modal" appearance={{ elements: { button: "rounded-full border border-slate-400 px-4 py-2 text-xs font-semibold" } }} />
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </nav>
          </header>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
