import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import prisma from "@/lib/db";

export const GET = async () => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const user = await prisma.users.findUnique({
      where: {
        email: payload.email as string,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.projects.findMany({
      where: {
        userEmail: user.email,
      },
      include: {
        tasks: true,
      },
    });

    return NextResponse.json({ projects }, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        error: "Some error occured. Please try again later!",
      },
      { status: 500 }
    );
  }
};
