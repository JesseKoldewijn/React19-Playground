import Link from "next/link";
import LoggedInStatus from "./auth/headerSections/logged-in";
import LoggedOutStatus from "./auth/headerSections/logged-out";
import type { validateRequest } from "@/server/auth/lucia";
import ThemeToggle from "./theme/toggle";
import { cookies } from "next/headers";
import { type Theme } from "@/store/theme";
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
  SheetFooter,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";

interface HeaderProps {
  requestCtx: Awaited<ReturnType<typeof validateRequest>>;
}

const Header = ({ requestCtx: validate }: HeaderProps) => {
  const theme = cookies().get("r19-theme")?.value == "light" ? "light" : "dark";

  return (
    <>
      <Sheet>
        <header className="sticky top-0 flex w-full items-center justify-between px-6 py-5">
          <div className="flex items-center justify-center">
            <Link href="/" className="underline-offset-2 hover:underline">
              React19 Playground
            </Link>
          </div>
          <div className="flex flex-row items-center justify-end gap-4 sm:gap-6">
            <DesktopNav validate={validate} />

            <ThemeToggle initialTheme={theme as Theme} />
            <MobileNav />
          </div>
        </header>

        <SheetContent className="flex flex-col">
          <SheetHeader className="pt-4">
            <SheetTitle>React19 Playground</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
          <SheetFooter className="mt-auto">
            {validate.user ? (
              <LoggedInStatus user={validate.user} />
            ) : (
              <LoggedOutStatus />
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Header;

const DesktopNav = ({
  validate,
}: {
  validate: Awaited<ReturnType<typeof validateRequest>>;
}) => {
  return (
    <nav className="hidden items-center justify-end sm:flex">
      <div className="mr-4 border-r-2 pr-2">
        <Button variant="link" asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>

      {validate.user ? (
        <LoggedInStatus user={validate.user} />
      ) : (
        <LoggedOutStatus />
      )}
    </nav>
  );
};

const MobileNav = () => {
  return (
    <div className="block sm:hidden">
      <Button size="icon" asChild>
        <SheetTrigger>
          <MenuIcon size={24} />
          <span className="sr-only">Open menu</span>
        </SheetTrigger>
      </Button>
    </div>
  );
};
