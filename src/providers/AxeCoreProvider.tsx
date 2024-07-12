"use client";

import React, { useEffect } from "react";
import ReactDom from "react-dom";

import { env } from "@/env";

const AxeCoreProvider = ({ children }: { children: React.ReactNode }) => {
  const handleAxeImport = async () => {
    if (env.NODE_ENV == "production") return;
    const axeCore = await import("@axe-core/react").then((mod) => mod.default);

    void axeCore(React, ReactDom, 1000, {
      // axe options
    });
  };

  useEffect(() => {
    void handleAxeImport();
  }, []);

  return <>{children}</>;
};

export default AxeCoreProvider;
