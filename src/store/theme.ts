"use client";

import { createStore } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export const themeCookieName = "r19-theme";

export type Theme = "loading" | "dark" | "light";

export interface ThemeState {
  theme: Theme;
}

export interface ThemeActions {
  setTheme: (newTheme: Theme) => void;
  toggleTheme: () => void;
}

export type ThemeStore = ThemeState & ThemeActions;

export const defaultInitState: ThemeStore = {
  theme: "dark",
  setTheme: () => ({}),
  toggleTheme: () => ({}),
};

export const createThemeStore = (initState: ThemeStore = defaultInitState) => {
  return createStore<ThemeStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          theme: "loading",
          setTheme: (theme: string) =>
            set((state) => {
              if (theme === "dark" || theme === "light") {
                const newTheme = theme;

                const now = new Date();
                const expires = new Date(
                  now.getTime() + 1000 * 60 * 60 * 24 * 365,
                );
                document.cookie = `${themeCookieName}=${newTheme}; path=/; expires=${expires.toUTCString()}; SameSite=Strict; Secure`;

                document.documentElement.classList.remove("dark", "light");
                document.documentElement.classList.add(newTheme);

                return { ...state, theme };
              }
              return state;
            }),
          toggleTheme: () =>
            set((state) => {
              const newTheme = state.theme === "dark" ? "light" : "dark";

              const now = new Date();
              const expires = new Date(
                now.getTime() + 1000 * 60 * 60 * 24 * 365,
              );
              document.cookie = `${themeCookieName}=${newTheme}; path=/; expires=${expires.toUTCString()}; SameSite=Strict; Secure`;

              document.documentElement.classList.remove("dark", "light");
              document.documentElement.classList.add(newTheme);

              return { theme: newTheme };
            }),
        }),
        {
          name: "theme_store",
          storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
          onRehydrateStorage: (_state) => {
            return (state, error) => {
              if (error) {
                console.error("an error happened during hydration", error);
              } else {
                console.debug("hydration finished", state);
              }
            };
          },
        },
      ),
    ),
  );
};
