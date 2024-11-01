import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import prisma from "@/lib/db";
import { createProjectValidator } from "@/validators/create-project-validator";

export const POST = async (req: NextRequest) => {
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
      include: {
        subscriptionDetails: true,
        projects: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      !user.subscriptionDetails ||
      user.subscriptionDetails.currentPeriodEnd < new Date() ||
      user.subscriptionDetails.status === "cancelled"
    ) {
      if (user.projects.length >= 1) {
        return NextResponse.json(
          {
            error: "Please upgrade your plan to create a new project",
          },
          { status: 403 }
        );
      }
    }

    if (user.projects.length > 10) {
      return NextResponse.json(
        {
          error: "Please upgrade your plan to create a new project",
        },
        { status: 403 }
      );
    }

    const data = await req.json();

    const { status, title, description } =
      await createProjectValidator.parseAsync(data);

    await prisma.projects.create({
      data: {
        status,
        title,
        description,
        userEmail: user.email,
      },
    });

    return NextResponse.json({ message: "Project created successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 422 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Some error occured. Please try again later!",
        },
        { status: 500 }
      );
    }
  }
};
