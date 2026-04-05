import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Thiếu email" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { isActive: true },
    });

    if (!user) {
      return NextResponse.json({ blocked: false });
    }

    return NextResponse.json({ blocked: !user.isActive });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}