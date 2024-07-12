import type { ServerRuntime } from "next";
import { notFound } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

export const runtime: ServerRuntime = "edge";

// This is a route that requests get redirected to if they are blocked
export const GET = async (req: NextRequest) => {
  const headers = req.headers;

  const clientIp = headers.get("x-client-ip");
  const originalUrl = headers.get("x-origin-url");
  const originalMethod = headers.get("x-origin-method");

  if (!clientIp || !originalUrl || !originalMethod) {
    return notFound();
  }

  return NextResponse.json(
    {
      message: "You are not allowed to access this resource",
      requestDetails: {
        ip: clientIp,
        url: originalUrl,
        method: originalMethod,
      },
    },
    {
      status: 403,
    },
  );
};
