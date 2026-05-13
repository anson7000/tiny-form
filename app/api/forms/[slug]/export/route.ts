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

// Helper: Convert JSON submissions to CSV
function convertToCSV(submissions: any[], fields: any[]) {
    // Get field labels for headers
    const fieldLabels = fields.map((f: any) => f.label);

    // Combine with metadata headers
    const headers = [...fieldLabels, 'Status', 'Submitted At', 'Replied At'];

    // Build CSV rows
    const rows = submissions.map((sub) => {
        const row = fieldLabels.map((label: string) => {
            const value = sub.data[label] || '';
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });

        // Add status and timestamps
        row.push(sub.status);
        row.push(new Date(sub.createdAt).toISOString());
        row.push(sub.repliedAt ? new Date(sub.repliedAt).toISOString() : '');

        return row.join(',');
    });

    // Combine headers and rows
    return [headers.join(','), ...rows].join('\n');
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // Get form with fields
        const form = await prisma.form.findUnique({
            where: { slug },
            select: {
                id: true,
                title: true,
                fields: true,
            },
        });

        if (!form) {
            return NextResponse.json(
                { error: 'Form not found' },
                { status: 404 }
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

        // Get all submissions
        const submissions = await prisma.submission.findMany({
            where: { formId: form.id },
            orderBy: { createdAt: 'desc' },
        });

        // Convert to CSV
        const fields = form.fields as any[];
        const csv = convertToCSV(submissions, fields);

        // Generate filename
        const date = new Date().toISOString().split('T')[0];
        const filename = `tinyform-submissions-${date}.csv`;

        // Return CSV file
        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json(
            { error: 'Failed to export submissions' },
            { status: 500 }
        );
    }
}