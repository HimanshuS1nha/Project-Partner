import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;

  if (
    pathname === "/api/is-logged-in" ||
    pathname === "/api/login" ||
    pathname === "/api/signup" ||
    pathname === "/api/verify-email" ||
    pathname === "/api/resend-otp" ||
    pathname === "/api/forgot-password" ||
    pathname === "/api/forgot-password/verify" ||
    pathname === "/api/forgot-password/create-new-password"
  ) {
    return NextResponse.next();
  }

  const token = cookies().get("token")?.value;

  if (!token) {
    if (
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/verify-email" ||
      pathname === "/forgot-password" ||
      pathname === "/forgot-password/verify" ||
      pathname === "/forgot-password/create-new-password"
    ) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );
  if (!payload.email) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/verify-email" ||
    pathname === "/forgot-password" ||
    pathname === "/forgot-password/verify" ||
    pathname === "/forgot-password/create-new-password"
  ) {
    return NextResponse.redirect(new URL("/dashboard/projects", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/forgot-password/verify",
    "/forgot-password/create-new-password",
    "/api/:path*",
    "/change-password",
  ],
};
