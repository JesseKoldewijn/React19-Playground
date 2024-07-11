import Link from "next/link";
import LoggedInStatus from "./auth/headerSections/logged-in";
import LoggedOutStatus from "./auth/headerSections/logged-out";
import type { validateRequest } from "@/server/auth/lucia";
import ThemeToggle from "./theme/toggle";
import { cookies } from "next/headers";
import { type Theme } from "@/store/theme";

interface HeaderProps {
  requestCtx: Awaited<ReturnType<typeof validateRequest>>;
}

const Header = ({ requestCtx: validate }: HeaderProps) => {
  const theme = cookies().get("r19-theme")?.value == "light" ? "light" : "dark";

  return (
    <header className="sticky top-0 flex w-full items-center justify-between px-6 py-5">
      <div className="flex items-center justify-center">
        <Link href="/" className="underline-offset-2 hover:underline">
          React19 Playground
        </Link>
      </div>
      <div className="flex flex-row items-center justify-center gap-6">
        <nav>
          {validate.user ? (
            <LoggedInStatus user={validate.user} />
          ) : (
            <LoggedOutStatus />
          )}
        </nav>
        <ThemeToggle initialTheme={theme as Theme} />
      </div>
    </header>
  );
};

export default Header;
