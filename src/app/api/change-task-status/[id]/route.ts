import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

import prisma from "@/lib/db";
import { changeTaskStatusValidator } from "@/validators/change-task-status-validator";

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

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

    const task = await prisma.tasks.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const project = await prisma.projects.findUnique({
      where: {
        id: task.projectId,
      },
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (project.userEmail !== user.email) {
      return NextResponse.json({ error: "Access denied" }, { status: 401 });
    }

    const data = await req.json();
    const { status } = await changeTaskStatusValidator.parseAsync(data);

    await prisma.tasks.update({
      where: {
        id: task.id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(
      { message: "Task updated successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Some error occured. Please try again later!" },
      { status: 500 }
    );
  }
};
