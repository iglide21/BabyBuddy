import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next({ request });
}

// Only run for API routes
export const config = {
  matcher: ["/api/:path*"],
};
