import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";

export const POST = async () => {
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

    const subscription = await prisma.subscriptionDetails.findUnique({
      where: {
        userEmail: user.email,
      },
    });
    if (subscription && subscription.currentPeriodEnd > new Date()) {
      return NextResponse.json(
        { error: "You are already on the Pro Plan" },
        { status: 409 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1QDpf8SJN0Kv6QsT4f3movEw",
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.APP_URL}`,
      cancel_url: `${process.env.APP_URL}/pricing`,
      client_reference_id: user.id,
      currency: "INR",
      customer_email: user.email,
      billing_address_collection: "required",
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Some error occured. Please try again later!" },
      { status: 500 }
    );
  }
};
