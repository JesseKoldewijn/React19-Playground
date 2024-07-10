import { Lucia } from "lucia";
import { DrizzleMySQLAdapter } from "@lucia-auth/adapter-drizzle";
import { cookies, headers } from "next/headers";
import { cache } from "react";

import type { Session, User } from "lucia";
import { db } from "../db";
import { sessionTable, userTable } from "../schema";

// import { webcrypto } from "crypto";
// globalThis.crypto = webcrypto as Crypto;

const adapter = new DrizzleMySQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      clientIP: attributes.clientIP,
    };
  },
});

export const validateRequest = cache(
  async (): Promise<
    | { user: User; clientIP: string; session: Session }
    | { user: null; clientIP: string; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    const clientIP = headers().get("x-forwarded-for");

    if (!sessionId) {
      return {
        user: null,
        clientIP: clientIP ?? "unknown",
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session?.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}

    return {
      user: result.user,
      clientIP: clientIP ?? "unknown",
      session: result.session,
    } as
      | {
          user: User;
          clientIP: string;
          session: Session;
        }
      | {
          user: null;
          clientIP: string;
          session: null;
        };
  },
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseSessionAttributes;
  }
  interface DatabaseSessionAttributes {
    username: string;
    clientIP: string;
  }
}
