import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

export const GET = async (req: NextRequest) => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const user = await prisma.users.findUnique({
      where: {
        email: payload.email as string,
      },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {}
};
