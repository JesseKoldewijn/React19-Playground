"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LoggedOutStatus = () => {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/signup") {
    return (
      <div className="flex flex-row items-center justify-center gap-4">
        {pathname === "/login" ? <RegisterLink /> : <LoginLink />}
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center justify-center gap-4">
      <LoginLink />
      <RegisterLink />
    </div>
  );
};

export default LoggedOutStatus;

const LoginLink = () => {
  return (
    <Link href="/login" className="underline-offset-2 hover:underline">
      Login
    </Link>
  );
};

const RegisterLink = () => {
  return (
    <Link href="/signup" className="underline-offset-2 hover:underline">
      Register
    </Link>
  );
};
