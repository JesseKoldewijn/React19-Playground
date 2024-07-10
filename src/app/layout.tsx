import LoggedInStatus from "@/components/auth/headerSections/logged-in";
import LoggedOutStatus from "@/components/auth/headerSections/logged-out";
import { validateRequest } from "@/server/auth/lucia";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "React.js 19 - Playground",
  description: "This application is a playground for React.js 19 features.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user, clientIP } = await validateRequest();

  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        <header className="sticky top-0 flex w-full items-center justify-between px-3 py-4">
          <div className="flex items-center justify-center">
            <Link href="/" className="underline-offset-2 hover:underline">
              React19 Playground
            </Link>
          </div>
          <nav className="flex flex-row items-center justify-center gap-6">
            {user ? <LoggedInStatus user={user} /> : <LoggedOutStatus />}
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
