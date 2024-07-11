/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    reactCompiler: true,
  },
  serverExternalPackages: ["@node-rs/argon2"],
  transpilePackages: ["three"],
  poweredByHeader: false,
};

export default config;
