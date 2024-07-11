"use client";

import { Button } from "@/components/ui/button";
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
    <div className="flex flex-row items-center justify-center gap-6">
      <LoginLink />
      <RegisterLink />
    </div>
  );
};

export default LoggedOutStatus;

const LoginLink = () => {
  return (
    <Button variant="link" size="sm" className="px-0" asChild>
      <Link href="/login">Login</Link>
    </Button>
  );
};

const RegisterLink = () => {
  return (
    <Button variant="link" size="sm" className="px-0" asChild>
      <Link href="/signup">Register</Link>
    </Button>
  );
};
