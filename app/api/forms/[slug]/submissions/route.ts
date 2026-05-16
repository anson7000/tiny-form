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

// GET - List submissions (authenticated)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Find the form
    const form = await prisma.form.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Verify authentication
    const isAuthenticated = await verifyAuth(request, form.id);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status"); // 'UNREAD', 'READ', 'REPLIED', or null for all
    const search = searchParams.get("search");

    // Build where clause
    const where: any = {
      formId: form.id,
    };

    if (status && ["UNREAD", "READ", "REPLIED"].includes(status)) {
      where.status = status;
    }

    // Get submissions
    const submissions = await prisma.submission.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        data: true,
        status: true,
        repliedAt: true,
        createdAt: true,
      },
    });

    // Client-side search filter (PostgreSQL JSONB search would be better for production)
    let filteredSubmissions = submissions;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredSubmissions = submissions.filter((sub) =>
        Object.values(sub.data as Record<string, any>).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchLower),
        ),
      );
    }

    // Count by status
    const counts = await prisma.submission.groupBy({
      by: ["status"],
      where: { formId: form.id },
      _count: true,
    });

    const statusCounts = {
      UNREAD: 0,
      READ: 0,
      REPLIED: 0,
      TOTAL: submissions.length,
    };

    counts.forEach(({ status, _count }) => {
      statusCounts[status] = _count;
    });

    return NextResponse.json({
      submissions: filteredSubmissions,
      counts: statusCounts,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}
