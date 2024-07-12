import type { ServerRuntime } from "next";
import { NextResponse, type NextRequest } from "next/server";

export const runtime: ServerRuntime = "edge";

export interface ClientDetailsResponse {
  clientDetails: {
    ip: string | undefined;
    ua: string | undefined;
  };
}

export const GET = async (req: NextRequest) => {
  const headers = req.headers;

  const body: ClientDetailsResponse = {
    clientDetails: {
      ip: req.ip ?? headers.get("x-forwarded-for") ?? undefined,
      ua: headers.get("user-agent") ?? undefined,
    },
  };

  return NextResponse.json(body);
};
