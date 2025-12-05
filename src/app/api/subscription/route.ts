// src/app/api/subscription/status/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/connect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CustomUser } from "@/lib/next-auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  let userId: string;
  let userData: CustomUser | null = null;

  // 1. Try normal session
  if (session?.user?.id) {
    userId = session.user.id;
    userData = session.user as CustomUser;
  }
  // 2. Fallback: Bearer token (for client-side calls)
  else {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const sessionRecord = await prisma.session.findFirst({
      where: { sessionToken: token },
      include: { user: true },
    });

    if (!sessionRecord || sessionRecord.expires < new Date()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    userId = sessionRecord.user.id;
    userData = {
      id: sessionRecord.user.id,
      email: sessionRecord.user.email,
      role: sessionRecord.user.role,
      status: sessionRecord.user.status,
      firstName: sessionRecord.user.firstName ?? undefined,
      lastName: sessionRecord.user.lastName ?? undefined,
      subscriptionStatus: undefined,
    };
  }

  try {
    // Use userId (unique) instead of findFirst + id
    const existing = await prisma.subscription.findUnique({
      where: { userId },
      include: { iulSales: { where: { verified: true } } },
    });

    let status: string;

    if (!existing) {
      status = "none";
    } else if (
      existing.status === "trialing" &&
      existing.renewalDate &&
      existing.renewalDate < new Date() &&
      existing.iulSales.length === 0
    ) {
      // Trial expired, no sale → mark expired
      await prisma.subscription.update({
        where: { userId },
        data: { status: "expired" },
      });
      status = "expired";
    } else if (existing.iulSales.length > 0 && existing.status !== "active") {
      // Has verified sale → grant free access
      await prisma.subscription.update({
        where: { userId },
        data: { status: "active" },
      });
      status = "active";
    } else {
      status = existing.status;
    }

    // Update session user object if present
    if (userData) {
      userData.subscriptionStatus = status;
    }

    const response = NextResponse.json({ status });
    response.cookies.set("subscription-status", status, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error) {
    console.error("Subscription status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
