import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { hash } from "bcrypt";

import prisma from "@/lib/db";
import { createNewPasswordValidator } from "@/validators/create-new-password-validator";

export const POST = async (req: NextRequest) => {
  try {
    const token = cookies().get("passwordChangeToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const { email, isPasswordChangeAllowed } = payload as {
      email: string;
      isPasswordChangeAllowed: boolean;
    };
    if (!isPasswordChangeAllowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { confirmPassword, newPassword } =
      await createNewPasswordValidator.parseAsync(data);

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 422 }
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

    cookies().delete("passwordChangeToken");

    return NextResponse.json(
      { message: "Password updated successfully" },
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
        { error: "Some error occured. Please try again later!" },
        { status: 500 }
      );
    }
  }
};
