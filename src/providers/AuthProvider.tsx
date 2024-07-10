import { createContext, use } from "react";
import type { Session, User } from "lucia";
import { useSignals } from "@preact/signals-react/runtime";
import { type Signal, signal } from "@preact/signals-react";
import { Prettify } from "@/util_types";

interface AuthContextValue {
  user: Signal<User | null>;
  clientIP: Signal<string>;
  session: Signal<Session | null>;
}

const AuthContext = createContext<AuthContextValue>({
  user: signal<User | null>(null),
  clientIP: signal<string>("unknown"),
  session: signal<Session | null>(null),
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
  const user = signal<User | null>(rest.user);
  const clientIP = signal<string>(rest.clientIP);
  const session = signal<Session | null>(rest.session);

  useSignals();

  const value = { user, clientIP, session };

  return <AuthContext value={value}>{children}</AuthContext>;
};
export default AuthProvider;

export const useAuth = () => {
  const ctx = use(AuthContext) as Prettify<AuthContextValue>;

  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");

  return ctx;
};
