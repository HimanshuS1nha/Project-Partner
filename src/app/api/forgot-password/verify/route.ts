import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

import prisma from "@/lib/db";
import { verifyEmailValidator } from "@/validators/verify-email-validator";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { email, otp } = await verifyEmailValidator.parseAsync(data);

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const otpEntry = await prisma.otp.findUnique({
      where: {
        userEmail: user.email,
      },
    });
    if (!otpEntry) {
      return NextResponse.json({ error: "Please resend otp" }, { status: 400 });
    }
    if (otpEntry.expiresIn < new Date()) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 422 });
    }
    if (otpEntry.otp !== parseInt(otp)) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
      },
    });
    await prisma.otp.deleteMany({
      where: {
        userEmail: user.email,
      },
    });

    const token = await new SignJWT({
      email: user.email,
      isPasswordChangeAllowed: true,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("10d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    cookies().set("passwordChangeToken", token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: 864000,
    });

    return NextResponse.json(
      { message: "Email verified successfully" },
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
