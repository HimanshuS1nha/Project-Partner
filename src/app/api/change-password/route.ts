import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { ZodError } from "zod";
import { hash, compare } from "bcrypt";

import prisma from "@/lib/db";
import { changePasswordValidator } from "@/validators/change-password-validator";

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
    const { confirmPassword, newPassword, oldPassword } =
      await changePasswordValidator.parseAsync(data);

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 422 }
      );
    }

    const doesPasswordMatch = await compare(oldPassword, user.password);
    if (!doesPasswordMatch) {
      return NextResponse.json(
        { error: "Password is incorrect" },
        { status: 401 }
      );
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
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
