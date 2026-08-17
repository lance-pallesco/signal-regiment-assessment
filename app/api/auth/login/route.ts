import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Username or Email is required"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues?.[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { identifier, password } = result.data;

    // Search by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: identifier, mode: "insensitive" } },
          { email: { equals: identifier, mode: "insensitive" } },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username/email or password" },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid username/email or password" },
        { status: 401 }
      );
    }

    const sessionPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = await signSessionToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
      message: "Authentication successful",
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
