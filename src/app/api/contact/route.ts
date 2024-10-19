import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import prisma from "@/lib/db";
import { contactUsValidator } from "@/validators/contact-us-validator";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { email, message, name, subject } =
      await contactUsValidator.parseAsync(data);

    await prisma.contactFormDetails.create({
      data: {
        email,
        message,
        name,
        subject,
      },
    });

    return NextResponse.json(
      { message: "Form submitted successfully" },
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
