import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { getSecretKey } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, pin } = body;

    // Validate PIN format
    if (!pin || !/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: "Invalid PIN format" },
        { status: 400 },
      );
    }

    // Find the form
    const form = await prisma.form.findUnique({
      where: { slug },
      select: {
        id: true,
        pinHash: true,
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    // Verify PIN
    const isValid = await bcrypt.compare(pin, form.pinHash);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    // Create JWT token
    const token = await new SignJWT({
      formId: form.id,
      slug: slug,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(getSecretKey());

    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: "Authentication successful",
      redirectUrl: `/dashboard/${slug}`,
    });

    response.cookies.set({
      name: "tinyform_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    message: "Logged out successfully",
  });

  response.cookies.set({
    name: "tinyform_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
