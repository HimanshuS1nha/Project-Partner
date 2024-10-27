import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    const event = stripe.webhooks.constructEvent(
      data,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
        { expand: ["items.data.price.product"] }
      );

      if (!session.client_reference_id) {
        return NextResponse.json(
          { error: "Some error occured. Please try again later!" },
          { status: 500 }
        );
      }

      const user = await prisma.users.findUnique({
        where: {
          id: session.client_reference_id,
        },
      });
      if (!user) {
        return NextResponse.json(
          { error: "Some error occured. Please try again later!" },
          { status: 500 }
        );
      }

      const plan = subscription.items.data[0]?.price;
      if (!plan) {
        return NextResponse.json(
          { error: "Some error occured. Please try again later!" },
          { status: 500 }
        );
      }

      await prisma.subscriptionDetails.create({
        data: {
          userEmail: user.email,
          priceId: plan.id,
          subscriptionId: subscription.id,
          customerId: subscription.customer as string,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
    }

    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
        { expand: ["items.data.price.product"] }
      );

      const plan = subscription.items.data[0]?.price;
      if (!plan) {
        return NextResponse.json(
          { error: "Some error occured. Please try again later!" },
          { status: 500 }
        );
      }

      await prisma.subscriptionDetails.update({
        where: {
          subscriptionId: subscription.id,
        },
        data: {
          priceId: plan.id,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
        { expand: ["items.data.price.product"] }
      );

      const existingSubscription = await prisma.subscriptionDetails.findUnique({
        where: {
          subscriptionId: subscription.id,
        },
      });
      if (!existingSubscription) {
        return NextResponse.json(
          { error: "Subscription does not exist" },
          { status: 200 }
        );
      }
      await prisma.subscriptionDetails.update({
        where: {
          id: existingSubscription.id,
        },
        data: {
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
    }
    return NextResponse.json({ message: "Received" }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Some error occured. Please try again later" },
      { status: 500 }
    );
  }
};
