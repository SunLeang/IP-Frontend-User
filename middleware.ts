import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // For volunteer routes, verify proper authentication
  if (path.startsWith("/volunteer-role")) {
    // Allow bypass parameters during role switching
    if (searchParams.get("reset") === "true") {
      return NextResponse.next();
    }

    const userRole = request.cookies.get("userRole")?.value;
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnTo", path);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "VOLUNTEER") {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      unauthorizedUrl.searchParams.set("reason", "role");
      unauthorizedUrl.searchParams.set("current", userRole || "unknown");
      unauthorizedUrl.searchParams.set("required", "VOLUNTEER");
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // For root path, check if user is volunteer and redirect to volunteer dashboard
  if (path === "/") {
    const userRole = request.cookies.get("userRole")?.value;

    if (userRole === "VOLUNTEER") {
      return NextResponse.redirect(
        new URL("/volunteer-role/dashboard", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/volunteer-role/:path*"],
};
