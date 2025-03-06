import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const protectedRoutes = ["/user", "/admin"];

  if (
    !token &&
    protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  ) {
    const returnUrl = req.nextUrl.pathname;
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.set("returnUrl", returnUrl);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/admin/:path*"],
};
