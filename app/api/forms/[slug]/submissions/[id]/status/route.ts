import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { jwtVerify } from 'jose';

const getSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not set');
    return new TextEncoder().encode(secret);
};

async function verifyAuth(request: NextRequest) {
    const token = request.cookies.get('tinyform_token')?.value;
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, getSecretKey());
        return payload as { formId: string; slug: string };
    } catch {
        return null;
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; id: string }> }
) {
    try {
        const { slug, id } = await params;
        const body = await request.json();
        const { status } = body;

        // Validate status
        if (!status || !['READ', 'REPLIED'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be READ or REPLIED' },
                { status: 400 }
            );
        }

        // Verify authentication
        const auth = await verifyAuth(request);
        if (!auth || auth.slug !== slug) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Verify submission belongs to this form
        const submission = await prisma.submission.findFirst({
            where: {
                id,
                formId: auth.formId,
            },
        });

        if (!submission) {
            return NextResponse.json(
                { error: 'Submission not found' },
                { status: 404 }
            );
        }

        // Update status
        const updated = await prisma.submission.update({
            where: { id },
            data: {
                status,
                repliedAt: status === 'REPLIED' ? new Date() : null,
            },
            select: {
                id: true,
                status: true,
                repliedAt: true,
            },
        });

        return NextResponse.json({
            message: `Submission marked as ${status.toLowerCase()}`,
            submission: updated,
        });
    } catch (error) {
        console.error('Status update error:', error);
        return NextResponse.json(
            { error: 'Failed to update status' },
            { status: 500 }
        );
    }
}