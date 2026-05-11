import { prisma } from "@/app/lib/prisma";

// GET /api/forms
export async function GET() {
    const forms = await prisma.form.findMany();
    return new Response(JSON.stringify(forms), {
        headers: { "Content-Type": "application/json" },
    });
}