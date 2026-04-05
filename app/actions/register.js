"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function registerUser(formData) {
  try {
    const { fullName, email, phone, password, confirmPassword } = formData;

    // Validate password match
    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Mật khẩu xác nhận không khớp",
      };
    }

    // Validate password length
    if (password.length < 8) {
      return {
        success: false,
        message: "Mật khẩu phải có ít nhất 8 ký tự",
      };
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return {
        success: false,
        message: "Email này đã được đăng ký",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        password: hashedPassword,
        role: "USER",
        isActive: true,
      },
    });

    revalidatePath("/login");

    return {
      success: true,
      message: "Đăng ký thành công. Vui lòng đăng nhập",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Lỗi đăng ký. Vui lòng thử lại sau",
    };
  }
}
