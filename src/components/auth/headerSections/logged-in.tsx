import { Button } from "@/components/ui/button";
import { type ActionResult, Form } from "@/server/auth/form";
import { lucia } from "@/server/auth/lucia";
import { db } from "@/server/db";
import { sessionTable } from "@/server/schema";
import { eq } from "drizzle-orm";
import type { DatabaseSessionAttributes } from "lucia";
import { LogOutIcon } from "lucide-react";
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
      className="flex flex-row items-center justify-center gap-1 sm:gap-4"
      {...rest}
    >
      <div className="hidden items-center justify-center sm:flex">
        <span>Welcome back, {user.username}!</span>
      </div>
      <Button
        type="submit"
        size="icon"
        className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full sm:hidden"
      >
        <LogOutIcon className="h-5 w-5" />
        <span className="sr-only">Sign Out</span>
      </Button>
      <Button
        type="submit"
        variant="link"
        size="sm"
        className="hidden items-center justify-center px-0 sm:flex"
      >
        Sign Out
      </Button>
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
    await db
      .delete(sessionTable)
      .where(eq(sessionTable.id, oldSessionId))
      .execute();
  }

  headers.set("Set-Cookie", sessionCookie.serialize());
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/?signedOut=true");
}
