import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import prisma from "@/lib/db";
import { createTaskValidatorServer } from "@/validators/create-task-validator";

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
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { endDate, projectId, startDate, status, title, description } =
      await createTaskValidatorServer.parseAsync(data);

    const project = await prisma.projects.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (project.userEmail !== user.email) {
      return NextResponse.json({ error: "Access denied" }, { status: 401 });
    }

    await prisma.tasks.create({
      data: {
        title,
        description,
        endDate,
        startDate,
        status,
        projectId,
      },
    });

    return NextResponse.json(
      { message: "Task created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 422 }
      );
    } else {
      return NextResponse.json(
        { error: "Some error occured. Please try again later!" },
        { status: 500 }
      );
    }
  }
};
