import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { jwtVerify } from "jose";

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(secret);
};

// Verify JWT token from cookie
async function verifyAuth(request: NextRequest, formId: string) {
  const token = request.cookies.get("tinyform_token")?.value;

  if (!token) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.formId === formId;
  } catch {
    return false;
  }
}

// POST - Public form submission
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { data } = body;

    // Basic validation
    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Invalid submission data" },
        { status: 400 },
      );
    }

    // Find the form
    const form = await prisma.form.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        formId: form.id,
        data: data,
        status: "UNREAD",
      },
    });

    return NextResponse.json(
      {
        message: "Thank you! Your submission has been received.",
        submissionId: submission.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 },
    );
  }
}
