import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "signal_regiment_philippine_army_secret_key_2026"
);

const SESSION_COOKIE_NAME = "signal_pims_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  const isProtectedPath = pathname.startsWith("/dashboard") || pathname.startsWith("/personnel");
  const isAuthPage = pathname === "/" || pathname === "/login";

  // Redirect unauthenticated user trying to access protected paths to login page
  if (isProtectedPath && !isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated user from login page to dashboard
  if (isAuthPage && isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/personnel/:path*"],
};
