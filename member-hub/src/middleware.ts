import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Client-side route protection for first paint.
 *
 * Better Auth sets a signed, httpOnly session cookie on sign-in. This
 * middleware reads only the cookie's existence (no crypto involved) to avoid
 * a flash of protected content for logged-out visitors. The real
 * authorization check happens server-side in each page via `requireUser`.
 */
const PUBLIC_PATHS = new Set(["/", "/login", "/signup", "/forgot-password", "/verify-email", "/reset-password"]);

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request.headers);
  const { pathname } = request.nextUrl;
  const isAuthPage = ["/login", "/signup", "/forgot-password", "/verify-email", "/reset-password"].includes(pathname);

  if (!sessionCookie && !PUBLIC_PATHS.has(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Logged-in users visiting auth pages go straight to the dashboard.
  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match every route except the auth API and static assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
