import { type ActionResult, Form } from "@/server/auth/form";
import { lucia } from "@/server/auth/lucia";
import { db } from "@/server/db";
import { sessionTable } from "@/server/schema";
import { eq } from "drizzle-orm";
import type { DatabaseSessionAttributes } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type HTMLAttributes } from "react";

const LoggedInStatus = async ({
  user,
  ...rest
}: {
  user: DatabaseSessionAttributes;
} & HTMLAttributes<HTMLFormElement>) => {
  return (
    <Form
      action={handleSignout}
      className="flex flex-row items-center justify-center gap-4"
      {...rest}
    >
      <div>
        <span>Welcome back, {user.username}!</span>
        <span className="text-xs">IP: {JSON.stringify(user)}</span>
      </div>
      <button type="submit" className="underline-offset-2 hover:underline">
        Sign Out
      </button>
    </Form>
  );
};

export default LoggedInStatus;

async function handleSignout(): Promise<ActionResult> {
  "use server";
  const oldSessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  const headers = new Headers();
  const sessionCookie = lucia.createBlankSessionCookie();

  if (oldSessionId) {
    const removedOldSession = await db
      .delete(sessionTable)
      .where(eq(sessionTable.id, oldSessionId))
      .execute();
    console.log(removedOldSession, oldSessionId);
  }

  headers.set("Set-Cookie", sessionCookie.serialize());
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/");
}
