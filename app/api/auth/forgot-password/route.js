import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import crypto from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
        where: { email },
        data: {
          resetPasswordToken: token,
          resetPasswordExpires: expires,
        },
      });

      const resetUrl = `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/reset-password?token=${token}`;

      await sendEmail({
        to: email,
        subject: "Yêu cầu đặt lại mật khẩu",
        text: `Xin chào,\n\nBạn (hoặc người khác) đã yêu cầu đặt lại mật khẩu. Vui lòng truy cập: ${resetUrl} để đặt mật khẩu mới.\n\nNếu bạn không yêu cầu, hãy bỏ qua email này.\n`,
        html: `<p>Xin chào,</p><p>Bạn (hoặc người khác) đã yêu cầu đặt lại mật khẩu.</p><p><a href="${resetUrl}">Nhấn vào đây để đặt lại mật khẩu</a></p><p>Nếu bạn không yêu cầu, bỏ qua email này.</p>`,
      });
    }

    // Trả chung, không tiết lộ email tồn tại hay không
    return NextResponse.json({ message: "Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đổi mật khẩu." });
  } catch (error) {
    console.error("forgot-password", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
