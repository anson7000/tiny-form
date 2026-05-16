import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose/jwt/verify";
import { SubmissionDashboard } from "@/app/ui/dashboard/submission-dashboard";
import { Submission } from "@/app/lib/types";
import { redirect } from "next/navigation";

// Get secret key for JWT signing
const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(secret);
};

// Verify JWT token from cookie
async function verifyAuth(formId: string) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("tinyform_token")?.value;

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

async function fetchSubmissions(formId: string) {
  const submissions = await prisma.submission.findMany({
    where: { formId },
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

  if (!submissions || submissions.length === 0) return [];

  return submissions;
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const form = await prisma.form.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!form) {
    // TODO: Show a nicer error page here
    return <div>Form not found</div>;
  }

  const isAuthenticated = await verifyAuth(form.id);

  if (!isAuthenticated) {
    // Redirect to /dashboard
    redirect("/dashboard");
  }

  const submissions = await fetchSubmissions(form.id);

  return (
    <SubmissionDashboard submissions={submissions as unknown as Submission[]} />
  );
}
