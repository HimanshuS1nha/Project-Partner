import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import prisma from "@/lib/db";
import { subscribeToNewsletterValidator } from "@/validators/subscriber-to-newsletter-validator";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { email } = await subscribeToNewsletterValidator.parseAsync(data);

    const existingNewsletterSubscriber =
      await prisma.newsletterSubscribers.findUnique({
        where: {
          email,
        },
      });
    if (existingNewsletterSubscriber) {
      return NextResponse.json(
        { error: "You are already subscribed to the newsletter" },
        { status: 409 }
      );
    }

    await prisma.newsletterSubscribers.create({
      data: {
        email,
      },
    });

    return NextResponse.json(
      { message: "Subscribed successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 422 }
      );
    } else {
      return NextResponse.json({
        error: "Some error occured. Please try again later!",
      });
    }
  }
};
