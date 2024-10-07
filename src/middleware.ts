import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;

  const token = cookies().get("token")?.value;
  if (!token) {
    if (pathname === "/login" || pathname === "/signup") {
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
  if (pathname === "/login" || pathname === "/signup") {
    return NextResponse.redirect(new URL("/dashboard/projects", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/login", "/signup"],
};
