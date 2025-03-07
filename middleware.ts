import { NextRequest, NextResponse } from "next/server";
import { GetUserInfoByJWT } from "./lib/jwt";

export const middleware = async (req: NextRequest) => {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  const token = req.cookies.get("token")?.value;
  const tokenData = token ? await GetUserInfoByJWT(token) : null;
  const isAdmin = tokenData?.isAdmin;

  const protectedRoutes = ["/user", "/admin"];
  const currentPath = req.nextUrl.pathname;

  if (!token) {
    if (protectedRoutes.some((route) => currentPath.startsWith(route))) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.set("prevUrl", currentPath);
      return response;
    }
  } else if (!isAdmin && currentPath.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
};

export const config = {
  runtime: "nodejs",
  matcher: ["/user/:path*", "/admin/:path*"],
};
