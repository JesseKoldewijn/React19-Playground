import Link from "next/link";

import { verify } from "@node-rs/argon2";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { lucia, validateRequest } from "@/server/auth/lucia";
import { Form, type ActionResult } from "@/server/auth/form";
import { db } from "@/server/db";
import { userTable } from "@/server/schema";
import { eq } from "drizzle-orm";
import { cleanExpiredSessions } from "@/server/auth/_helpers/clean-sessions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function Page() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/");
  }

  return (
    <div className="inset-0 flex min-h-[92svh] w-full flex-col items-center justify-center">
      <div className="-mt-14 flex max-w-sm flex-col gap-4 text-center md:max-w-md">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <Form action={login}>
          <div className="flex w-full max-w-md flex-col gap-2 text-base">
            <div className="flex gap-2">
              <Label
                htmlFor="username"
                className="flex h-10 w-1/3 items-center justify-center font-medium"
              >
                Username
              </Label>
              <Input name="username" id="username" className="h-10 w-2/3" />
            </div>
            <div className="flex gap-2">
              <Label
                htmlFor="password"
                className="flex h-10 w-1/3 items-center justify-center"
              >
                Password
              </Label>
              <Input
                type="password"
                name="password"
                id="password"
                className="h-10 w-2/3"
              />
            </div>
            <Button className="mt-2 w-full py-2">Continue</Button>
          </div>
        </Form>
        <Button variant="link" asChild>
          <Link href="/signup">Create an account</Link>
        </Button>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function login(_: any, formData: FormData): Promise<ActionResult> {
  "use server";

  try {
    const username = formData.get("username");
    if (
      typeof username !== "string" ||
      username.length < 3 ||
      username.length > 31 ||
      !/^[a-z0-9_-]+$/.test(username)
    ) {
      return {
        error: "Invalid username",
      };
    }
    const password = formData.get("password");
    if (
      typeof password !== "string" ||
      password.length < 6 ||
      password.length > 255
    ) {
      return {
        error: "Invalid password",
      };
    }

    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.username, username))
      .execute()
      .then((rows) => rows[0]);

    if (!existingUser) {
      return {
        error: "Incorrect username or password",
      };
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      // NOTE:
      // Returning immediately allows malicious actors to figure out valid usernames from response times,
      // allowing them to only focus on guessing passwords in brute-force attacks.
      // As a preventive measure, you may want to hash passwords even for invalid usernames.
      // However, valid usernames can be already be revealed with the signup page among other methods.
      // It will also be much more resource intensive.
      // Since protecting against this is non-trivial,
      // it is crucial your implementation is protected against brute-force attacks with login throttling, 2FA, etc.
      // If usernames are public, you can outright tell the user that the username is invalid.
      return {
        error: "Incorrect username or password",
      };
    }

    await cleanExpiredSessions(existingUser.id);

    const clientIP = headers().get("x-forwarded-for");

    const session = await lucia.createSession(existingUser.id, {
      username: existingUser.username,
      clientIP: clientIP ?? "unknown",
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    console.error(error);
    return {
      error: "An error occurred. Please try again later.",
    };
  }
}
