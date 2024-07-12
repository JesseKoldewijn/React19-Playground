"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "../ui/button";
import type { Theme } from "@/store/theme";
import { type LucideProps, MoonIcon, SunIcon } from "lucide-react";

const ThemeToggle = ({ initialTheme }: { initialTheme?: Theme }) => {
  const currentTheme = useTheme((x) => x.theme);
  const toggleTheme = useTheme((x) => x.toggleTheme);

  return (
    <Button onClick={toggleTheme} size="icon">
      <ThemeIcon
        className="h-5 w-5"
        theme={
          currentTheme == "loading"
            ? initialTheme ?? "loading"
            : currentTheme ?? initialTheme
        }
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;

export const ThemeIcon = ({
  theme,
  ...rest
}: { theme: Theme } & LucideProps) => {
  switch (theme) {
    case "light":
      return <SunIcon {...rest} />;
    case "dark":
      return <MoonIcon {...rest} />;
    default:
      return null;
  }
};
