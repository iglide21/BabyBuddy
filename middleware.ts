import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./src/lib/supabase/server";

// This function can be marked `async` if using `await` inside
export const middleware = async (
  request: NextRequest,
  response: NextResponse
) => {
  if (request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to login if no user session
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
};

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
