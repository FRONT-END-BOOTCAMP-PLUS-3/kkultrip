import { NextRequest, NextResponse } from "next/server";
import { GetUserInfoByJWT } from "./utils/jwt";

export const middleware = async (req: NextRequest) => {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  const token = req.cookies.get("token")?.value;
  const tokenData = token ? await GetUserInfoByJWT(token) : null;
  const isAdmin = tokenData?.isAdmin;

  const protectedRoutes = [
    /^\/user/,
    /^\/admin/,
    /^\/spots\/[^/]+\/tips\/create$/,
  ];
  const currentPath = req.nextUrl.pathname;

  if (!tokenData) {
    if (protectedRoutes.some((route) => route.test(currentPath))) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.set("prevUrl", currentPath);
      return response;
    } else if (currentPath === "/login") {
      const prevUrl = req.cookies.get("prevUrl")?.value || "/";
      return NextResponse.redirect(new URL(prevUrl, req.url));
    }

    if (!isAdmin && currentPath.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
};

export const config = {
  matcher: ["/user/:path*", "/admin/:path*", "/spots/:path*/tips/:path*"],
};
