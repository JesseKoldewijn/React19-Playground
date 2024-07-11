import UserBadge from "@/components/auth/user-badge";
import Header from "@/components/header";
import AuthProvider from "@/providers/AuthProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import { validateRequest } from "@/server/auth/lucia";
import type { Theme } from "@/store/theme";
import "@/styles/tailwind.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "React.js 19 - Playground",
  description: "This application is a playground for React.js 19 features.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieJar = cookies();
  const themeCookie = cookieJar.get("r19-theme")?.value as Theme | undefined;
  const theme = themeCookie == "light" ? "light" : "dark";

  const validate = await validateRequest();

  return (
    <html lang="en" className={theme + " " + GeistSans.variable}>
      <body>
        <AuthProvider
          user={validate.user}
          clientIP={validate.clientIP}
          session={validate.session}
        >
          <ThemeProvider initialTheme={theme}>
            <Header requestCtx={validate} />
            {children}
            <UserBadge />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
