import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const currentPassword = (body.currentPassword || "").trim();
  const newPassword = (body.newPassword || "").trim();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Cần nhập mật khẩu hiện tại và mật khẩu mới" }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: "Mật khẩu mới cần ít nhất 8 ký tự" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: Number(session.user.id) } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Mật khẩu hiện tại không đúng" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: Number(session.user.id) },
    data: { password: hashedPassword },
  });

  return NextResponse.json({ message: "Đổi mật khẩu thành công." });
}
