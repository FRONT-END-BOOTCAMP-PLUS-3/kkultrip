import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const protectedRoutes = ["/user", "/admin"];

  if (
    !token &&
    protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
