"use client";

import { createContext, use, useEffect, useState } from "react";
import type { Session, User } from "lucia";
import type { Prettify } from "@/util_types";
import type { ClientDetailsResponse } from "@/app/api/client/route";
import { usePathname, useSearchParams } from "next/navigation";

interface AuthContextValue {
  user: User | null;
  clientIP: string;
  session: Session | null;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  clientIP: "unknown",
  session: null,
});

const AuthProvider = ({
  children,
  ...rest
}: {
  user: User | null;
  clientIP: string;
  session: Session | null;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<User | null>(rest.user);
  const [clientIP, setClientIP] = useState<string>(rest.clientIP);
  const [session, setSession] = useState<Session | null>(rest.session);

  const handleSignout = () => {
    const isSignoutQuery = searchParams.get("signedOut") === "true";
    if (isSignoutQuery) {
      setUser(null);
      setSession(null);
      // remove the query from the URL
      const sp = searchParams.toString();
      const cleanedSp = sp.replace(/&?signedOut=true/, "");
      window.location.search = cleanedSp;
    }
  };

  const updateClientIP = async () => {
    const lastFetchedString = localStorage.getItem("ipLastFetched");
    const lastFetched = lastFetchedString ? new Date(lastFetchedString) : null;

    if (
      lastFetched &&
      new Date().getTime() - lastFetched.getTime() < 1000 * 60 * 60
    ) {
      // if the IP was fetched less than an hour ago, don't fetch it again
      return;
    }

    const res = await fetch("/api/client");
    if (!res.ok) return;
    const { clientDetails } = (await res.json()) as ClientDetailsResponse;
    const { ip } = clientDetails;
    if (ip) {
      setClientIP(ip);
      localStorage.setItem("ipLastFetched", new Date().toISOString());
    }
  };

  useEffect(() => {
    handleSignout();
    void updateClientIP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  const value = { user, clientIP, session, setUser, setClientIP, setSession };

  return <AuthContext value={value}>{children}</AuthContext>;
};
export default AuthProvider;

export const useAuth = () => {
  const ctx = use(AuthContext) as Prettify<AuthContextValue>;

  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");

  return ctx;
};
