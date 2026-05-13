import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title = 'Untitled Form', fields = [], pin } = body;

        // Validate required fields
        if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
            return NextResponse.json(
                { error: 'PIN must be exactly 4 digits' },
                { status: 400 }
            );
        }

        if (!Array.isArray(fields) || fields.length === 0) {
            return NextResponse.json(
                { error: 'Form must have at least one field' },
                { status: 400 }
            );
        }

        // Generate unique slug
        const slug = nanoid(8); // e.g., "V1StGXR8"

        // Hash the PIN
        const pinHash = await bcrypt.hash(pin, 10);

        // Create form in database
        const form = await prisma.form.create({
            data: {
                slug,
                title,
                fields, // JSONB - Prisma handles serialization
                pinHash,
            },
            select: {
                slug: true,
                title: true,
                fields: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            {
                message: 'Form created successfully',
                form: {
                    ...form,
                    shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/form/${form.slug}`,
                    dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/${form.slug}`,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating form:', error);
        return NextResponse.json(
            { error: 'Failed to create form' },
            { status: 500 }
        );
    }
}