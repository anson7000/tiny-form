import { prisma } from '@/app/lib/prisma';
import { FormField } from '@/app/store/form-store';
import { PublicForm } from '@/app/ui/form/public-form';
import { FormNotFound } from '@/app/ui/form/form-not-found';

export default async function FormPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const form = await prisma.form.findUnique({
        where: { slug },
        select: {
            id: true,
            slug: true,
            title: true,
            fields: true,
        },
    });
    if (!form) {
        return <FormNotFound />;
    }
    const formFields = form.fields as unknown as FormField[];

    return <PublicForm formSlug={form.slug} formTitle={form.title} formFields={formFields} />;
}