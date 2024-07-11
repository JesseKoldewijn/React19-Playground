"use client";

import { createThemeStore, type Theme, type ThemeStore } from "@/store/theme";
import { createContext, use, useRef } from "react";
import { useStore } from "zustand";

export type ThemeStoreApi = ReturnType<typeof createThemeStore>;

export const ThemeStoreContext = createContext<ThemeStoreApi | undefined>(
  undefined,
);

const ThemeProvider = ({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: React.ReactNode;
}) => {
  const storeRef = useRef<ThemeStoreApi>(null);
  if (!storeRef.current) {
    const initialRef = createThemeStore();
    initialRef.setState({ theme: initialTheme });
    storeRef.current = initialRef;
  }

  const val: ThemeStoreApi = {
    ...storeRef.current,
  };

  return (
    <ThemeStoreContext.Provider value={val}>
      {children}
    </ThemeStoreContext.Provider>
  );
};

export default ThemeProvider;

export const useTheme = <T,>(selector: (store: ThemeStore) => T) => {
  const counterStoreContext = use(ThemeStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useTheme must be used within ThemeProvider`);
  }

  return useStore(counterStoreContext, selector);
};
