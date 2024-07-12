"use client";

import React, { useEffect } from "react";
import ReactDom from "react-dom";

const AxeCoreProvider = ({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) => {
  const handleAxeImport = async () => {
    if (!enabled) return;
    const axeCore = await import("@axe-core/react").then((mod) => mod.default);

    void axeCore(React, ReactDom, 1000, {
      // axe options
    });

    // console log with custom color
    console.log("%cAxe-core is enabled", "color: cyan");
  };

  useEffect(() => {
    void handleAxeImport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default AxeCoreProvider;
