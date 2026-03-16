import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const token = (body.token || "").trim();
    const password = (body.password || "").trim();

    if (!token || !password) {
      return NextResponse.json({ error: "Token và mật khẩu mới đều bắt buộc." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Mật khẩu phải có ít nhất 8 ký tự." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Token không hợp lệ hoặc đã hết hạn." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return NextResponse.json({ message: "Đổi mật khẩu thành công." });
  } catch (error) {
    console.error("reset-password", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
