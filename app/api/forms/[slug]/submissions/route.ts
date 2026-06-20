import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

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
