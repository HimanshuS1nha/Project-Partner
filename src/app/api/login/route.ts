import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { compare } from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

import prisma from "@/lib/db";
import { loginValidator } from "@/validators/login-validator";
import { generateOtp } from "@/lib/generate-otp";
import { sendEmail } from "@/lib/send-email";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { email, password } = await loginValidator.parseAsync(data);

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const doesPasswordMatch = await compare(password, user.password);
    if (!doesPasswordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      const otp = generateOtp();

      await prisma.otp.deleteMany({
        where: {
          userEmail: user.email,
        },
      });

      await prisma.otp.create({
        data: {
          otp,
          userEmail: user.email,
          expiresIn: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      const isEmailSent = await sendEmail(user.email, otp);
      if (!isEmailSent) {
        return NextResponse.json(
          { error: "Some error occured. Please try again later" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { isVerified: false, message: "Verify your email" },
        { status: 200 }
      );
    }

    const token = await new SignJWT({ email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("10d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    cookies().set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: 864000,
    });

    return NextResponse.json(
      {
        message: "Logged in successfully",
        user: { name: user.name, email: user.email },
        isVerified: true,
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
