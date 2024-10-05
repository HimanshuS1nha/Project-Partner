import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { hash } from "bcrypt";

import prisma from "@/lib/db";
import { generateOtp } from "@/lib/generate-otp";
import { sendEmail } from "@/lib/send-email";
import { signupValidator } from "@/validators/signup-validator";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { email, password, name, confirmPassword } =
      await signupValidator.parseAsync(data);

    if (confirmPassword !== password) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 422 }
      );
    }

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 401 }
      );
    }

    const hashedPassword = await hash(password, 10);

    await prisma.users.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const otp = generateOtp();

    await prisma.otp.deleteMany({
      where: {
        email,
      },
    });
    await prisma.otp.create({
      data: {
        otp,
        email,
        expiresIn: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    const isEmailSent = await sendEmail(email, otp);
    if (!isEmailSent) {
      return NextResponse.json(
        { error: "Some error occured. Please try again later" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Account created successfully. Verify your email now.",
      },
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
        { error: "Some error occured. Please try again later" },
        { status: 500 }
      );
    }
  }
};
