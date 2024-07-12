"use client";

import React, { useEffect } from "react";
import ReactDom from "react-dom";
import { type Spec } from "axe-core";

interface ReactSpec extends Spec {
  runOnly?: string[];
  disableDeduplicate?: boolean;
}

const AxeCoreProvider = ({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) => {
  const handleAxeImport = async () => {
    if (!enabled) return;
    const axeCoreBase = await import("axe-core");
    const axeCore = await import("@axe-core/react").then((mod) => mod.default);

    const wcag2 = ["wcag2a", "wcag2aa", "wcag2aaa"];
    const wcag21 = ["wcag21a", "wcag21aa"];
    const wcag22 = ["wcag22aa"];

    const totalRuleset = [
      ...wcag2,
      ...wcag21,
      ...wcag22,
      "wcag***",
      "best-practice",
    ];

    const wcagRules = axeCoreBase.getRules(totalRuleset)?.map((rule) => ({
      id: rule.ruleId,
      ...rule,
    }));

    const config: ReactSpec = {
      reporter: "v2",
      rules: [
        ...wcagRules,
        {
          id: "skip-link",
          enabled: true,
        },
      ],
      disableDeduplicate: true,
    };

    void axeCore(React, ReactDom, 1000, config);

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
