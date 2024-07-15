import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  // console.log(url.pathname, token, "154522262555");

  if (
    token &&
    (url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!token && url.pathname.startsWith("/editor")) {
    console.log("redirecting to login");

    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/login",
    "/sign-up",
    "/",
    "/editor/:path*",
    "/verify/:path*",
    "/forgot-password/:path*",
  ],
};