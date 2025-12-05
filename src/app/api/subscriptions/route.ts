// src/app/api/admin/subscriptions/route.ts  (or wherever it is)

import { NextResponse } from "next/server";
import prisma from "@/lib/connect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            foreverFree: true,
          },
        },
        iulSales: {
          where: { verified: true },
          select: { id: true },
        },
      },
      orderBy: { startDate: "desc" }, // newest first
    });

    const result = subscriptions.map((sub) => {
      const renewalDate = sub.renewalDate;
      const endDate = renewalDate?.toISOString() ?? null;
      const remainingDays = renewalDate
        ? Math.max(
            0,
            Math.ceil((renewalDate.getTime() - Date.now()) / 86_400_000)
          )
        : null;

      const fullName = [sub.user?.firstName, sub.user?.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();

      return {
        userId: sub.userId,
        status: sub.status,
        planType: sub.planType,
        startDate: sub.startDate.toISOString(),
        endDate,
        remainingDays,
        userEmail: sub.user?.email ?? "unknown@deleted",
        userName: fullName || "Unknown User",
        foreverFree: sub.user?.foreverFree ?? false,
        iulSalesCount: sub.iulSales.length,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin subscriptions fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}
