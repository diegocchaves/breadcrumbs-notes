import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const IsLoggedin = !!token;
  const { pathname } = req.nextUrl;

  // 🚫 Logged-out users trying to access protected pages
  if (!IsLoggedin && pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  // 🚫 Logged-in users trying to access auth pages
  if (IsLoggedin && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login"],
};
