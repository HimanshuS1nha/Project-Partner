import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import prisma from "@/lib/db";
import { forgotPasswordValidator } from "@/validators/forgot-password-validator";
import { generateOtp } from "@/lib/generate-otp";
import { sendEmail } from "@/lib/send-email";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();

    const { email } = await forgotPasswordValidator.parseAsync(data);

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const otp = generateOtp();

    await prisma.otp.deleteMany({
      where: {
        userEmail: user.email,
      },
    });
    await prisma.otp.create({
      data: {
        userEmail: user.email,
        otp,
        expiresIn: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    const isEmailSent = await sendEmail(user.email, otp);
    if (!isEmailSent) {
      return NextResponse.json(
        { error: "Error in sending otp. Please try again later" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Verify your email" }, { status: 201 });
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
