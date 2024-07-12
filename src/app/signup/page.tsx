import Link from "next/link";

import { hash } from "@node-rs/argon2";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { generateId } from "lucia";
import { lucia, validateRequest } from "@/server/auth/lucia";
import { type ActionResult, Form } from "@/server/auth/form";
import { db } from "@/server/db";
import { userTable } from "@/server/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Page = async () => {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }

  return (
    <div className="inset-0 flex min-h-[92svh] w-full flex-col items-center justify-center">
      <div className="-mt-14 flex max-w-sm flex-col gap-4 text-center md:max-w-md">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <Form action={signup}>
          <div className="flex w-full max-w-md flex-col gap-2 text-base">
            <div className="flex gap-2">
              <Label
                htmlFor="username"
                className="flex h-10 w-1/3 items-center justify-center"
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
          <Link href="/login">Login to your account</Link>
        </Button>
      </div>
    </div>
  );
};
export default Page;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function signup(_: any, formData: FormData): Promise<ActionResult> {
  "use server";

  try {
    const username = formData.get("username");
    // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
    // keep in mind some database (e.g. mysql) are case insensitive
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

    const passwordHash = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    const userId = generateId(15);

    try {
      await db
        .insert(userTable)
        .values({
          id: userId,
          username,
          passwordHash,
        })
        .execute();

      const clientIP = headers().get("x-forwarded-for");
      const session = await lucia.createSession(userId, {
        username,
        clientIP: clientIP ?? "unknown",
      });

      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    } catch (e) {
      // mysql db error message for duplicate entry
      const error = e as { code: string };
      if (error.code === "ER_DUP_ENTRY") {
        return {
          error: "Username already used",
        };
      }
      console.error(e);
      return {
        error: "An unknown error occurred during the signup process",
      };
    }
    return redirect("/");
  } catch (e) {
    console.error(e);
    return {
      error: "An unknown error occurred",
    };
  }
}
