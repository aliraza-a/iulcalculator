/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/connect";
import { randomUUID } from "crypto";
import { createTransporter } from "@/lib/nodemailer";

export async function POST(request: Request) {
  const transporter = await createTransporter();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { plan } = (await request.json()) as {
    plan: "trial" | "monthly" | "annual";
  };
  if (!plan || !["trial", "monthly", "annual"].includes(plan))
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, firstName: true, lastName: true },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const trialToken = await prisma.trialToken.findUnique({
    where: { userId: user.id },
  });

  const logEmail = async (
    type: string,
    to: string,
    subject: string,
    ok: boolean,
    subId?: string
  ) => {
    try {
      await prisma.emailLog.create({
        data: {
          userId: user.id,
          subscriptionId: subId,
          emailType: type,
          recipient: to,
          subject,
          status: ok ? "sent" : "failed",
          sentAt: new Date(),
        },
      });
    } catch {}
  };

  // 1. First-time trial
  if (!trialToken) {
    const sixtyDaysFromNow = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    const subscription = await prisma.subscription.upsert({
  where: { userId: user.id },
  update: {
    planType: plan,
    status: "trialing",
    renewalDate: sixtyDaysFromNow,
    startDate: new Date(),
  },
  create: {
    userId: user.id,
    planType: plan,
    status: "trialing",
    startDate: new Date(),
    renewalDate: sixtyDaysFromNow,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
  },
});

    await prisma.trialToken.create({
      data: {
        userId: user.id,
        token: randomUUID(),
        expiresAt: sixtyDaysFromNow,
      },
    });

    // Admin email
    try {
      await transporter.sendMail({
        from: `"IUL Calculator Pro" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL!,
        subject: "New Trial Activated",
        text: `User: ${user.firstName} ${user.lastName} (${user.email})\nPlan: ${plan}`,
      });
      await logEmail(
        "trial_admin",
        process.env.ADMIN_EMAIL!,
        "New Trial Activated",
        true,
        subscription.id
      );
    } catch {}

    // User welcome email
    try {
      await transporter.sendMail({
        from: `"IUL Calculator Pro" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Welcome! Your 60-day Trial is Active",
        html: `<p>Hi ${user.firstName},</p>
               <p>Your 60-day trial of IUL Calculator Pro is now active.</p>
               <p>Enjoy full access!</p>
               <p>– The Team</p>`,
      });
      await logEmail(
        "trial_user",
        user.email,
        "Welcome! Your 60-day Trial is Active",
        true,
        subscription.id
      );
    } catch {}

    return NextResponse.json(
      { message: "Trial activated", redirect: "/dashboard/home?success=true" },
      { status: 201 }
    );
  }

  const trialActive = trialToken.expiresAt > new Date();

  // 2. Trial still active → just change plan
  if (trialActive) {
    await prisma.subscription.update({
      where: { userId: user.id }, // @@unique([userId]) makes this valid
      data: { planType: plan },
    });

    return NextResponse.json({
      message: `Plan changed to ${plan}`,
      redirect: "/dashboard/home?success=true",
    });
  }

  // 3. Trial expired → allow paid plan (no payment gateway)
  if (plan !== "trial") {
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        planType: plan,
        status: "active",
        renewalDate: null,
      },
      create: {
        userId: user.id,
        planType: plan,
        status: "active",
        startDate: new Date(),
        // stripe fields remain null
      },
    });

    // Optional admin notification
    try {
      await transporter.sendMail({
        from: `"IUL Calculator Pro" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL!,
        subject: "New Paid Subscription",
        text: `User switched to paid\n${user.firstName} ${user.lastName} (${user.email})\nPlan: ${plan}`,
      });
    } catch {}

    return NextResponse.json({
      message: "Subscription activated",
      redirect: "/dashboard/home?success=true",
    });
  }

  return NextResponse.json(
    { error: "Trial expired – choose a paid plan" },
    { status: 400 }
  );
}

// GET – current subscription status
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    include: { iulSales: { where: { verified: true } } },
  });

  if (!subscription) return NextResponse.json({ status: "none" });

  const trialExpired =
    subscription.status === "trialing" &&
    subscription.renewalDate &&
    subscription.renewalDate < new Date() &&
    subscription.iulSales.length === 0;

  return NextResponse.json({
    status: trialExpired ? "expired" : subscription.status,
    planType: subscription.planType,
    endDate: subscription.renewalDate?.toISOString() ?? null,
    iulSalesCount: subscription.iulSales.length,
  });
}
