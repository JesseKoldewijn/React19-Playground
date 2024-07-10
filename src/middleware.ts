import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CORS_CONFIG = {
  enableOriginLock: false,
  enableGeneralLock: true,
};

const allowedOrigins = ["https://acme.com"];

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function middleware(request: NextRequest) {
  // Check the origin from the request
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = CORS_CONFIG.enableOriginLock
    ? allowedOrigins.includes(origin)
    : true;

  const { ip } = request;

  // Handle preflighted requests
  const isPreflight = request.method === "OPTIONS";

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  const ipAddr = ip ? ip : request.headers.get("x-forwarded-for");
  if (ip) response.headers.set("x-forwarded-for", ipAddr ?? "unknown");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
