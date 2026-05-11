import { prisma } from "@/app/lib/prisma";

// GET /api/submissions
export async function GET() {
    const submissions = await prisma.submission.findMany();
    return new Response(JSON.stringify(submissions), {
        headers: { "Content-Type": "application/json" },
    });
}