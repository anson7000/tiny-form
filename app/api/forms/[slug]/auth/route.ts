import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

// Get secret key for JWT signing
const getSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not set');
    return new TextEncoder().encode(secret);
};

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const body = await request.json();
        const { pin } = body;

        // Validate PIN format
        if (!pin || !/^\d{4}$/.test(pin)) {
            return NextResponse.json(
                { error: 'Invalid PIN format' },
                { status: 400 }
            );
        }

        // Rate limiting check (simple in-memory - use Redis in production)
        // TODO: Implement proper rate limiting for production

        // Find the form
        const form = await prisma.form.findUnique({
            where: { slug },
            select: {
                id: true,
                pinHash: true,
            },
        });

        if (!form) {
            // Use same error message to prevent form enumeration
            return NextResponse.json(
                { error: 'Invalid PIN' },
                { status: 401 }
            );
        }

        // Verify PIN
        const isValid = await bcrypt.compare(pin, form.pinHash);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid PIN' },
                { status: 401 }
            );
        }

        // Create JWT token (short-lived: 24 hours)
        const token = await new SignJWT({
            formId: form.id,
            slug: slug,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(getSecretKey());

        // Set HTTP-only cookie
        const response = NextResponse.json({
            message: 'Authentication successful',
            redirectUrl: `/dashboard/${slug}`,
        });

        response.cookies.set({
            name: 'tinyform_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}