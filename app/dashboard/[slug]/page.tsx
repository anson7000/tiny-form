import { prisma } from "@/app/lib/prisma";
import { SubmissionDashboard } from "@/app/ui/dashboard/submission-dashboard";
import { Submission } from "@/app/lib/types";
import { getPayloadFromToken, verifyAuth } from "@/app/lib/auth";
import { EntryPage } from "@/app/ui/dashboard/entry-page";

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

  const payload = await getPayloadFromToken();

  if (!payload) {
    console.log("No valid token found");
    return <EntryPage />;
  }

  const isAuthenticated = await verifyAuth(payload, slug);

  if (!isAuthenticated) {
    console.log("Authentication failed for slug:", slug);
    return <EntryPage />;
  }

  const submissions = await fetchSubmissions(payload.formId as string);

  return (
    <SubmissionDashboard submissions={submissions as unknown as Submission[]} />
  );
}
