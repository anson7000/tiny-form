'use client';

import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useFormStore } from "@/app/store/form-store";
import { Input } from "@/app/ui/common/input";
import { FieldPalette } from "@/app/ui/field-palette";
import { SortableField } from "@/app/ui/sortable-field";
import { Button } from '@/app/ui/common/button';
import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

export default function FormBuilder() {
    const {
        formTitle,
        formFields,
        isPublished,
        formSlug,
        setFormTitle,
        reorderFields,
        publishForm
    } = useFormStore();

    const [copied, setCopied] = useState(false);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = formFields.findIndex((field) => field.id === active.id);
            const newIndex = formFields.findIndex((field) => field.id === over.id);

            reorderFields(arrayMove(formFields, oldIndex, newIndex));
        }
    };

    const handlePublish = () => {
        if (formFields.length === 0) {
            alert('Please add at least one field to your form');
            return;
        }
        publishForm();
    };

    const copyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/f/${formSlug}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const openForm = () => {
        window.open(`/f/${formSlug}`, '_blank');
    };

    return (
        <div className="flex flex-col h-full">

            {/* Form Title */}
            <div className="p-6 border-b">
                <Input
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="text-2xl font-semibold border-none focus:ring-0 p-0"
                    placeholder="Form Title"
                />
            </div>

            {/* Form Builder Area */}
            <div className="flex-1 flex overflow-hidden">
                <div className="w-64 border-r p-4 overflow-y-auto">
                    <FieldPalette />
                </div>

                <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
                        {formFields.length === 0 ? (
                            <div className="text-center text-gray-400 py-12">
                                <p className="text-lg">Drag fields from the left to build your form</p>
                            </div>
                        ) : (
                            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={formFields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-4">
                                        {formFields.map((field) => (
                                            <SortableField key={field.id} field={field} />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Publish Section */}
            <div className="p-6 border-t bg-white">
                {isPublished ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 font-semibold mb-2">Form Published! 🎉</p>
                        <div className="flex items-center gap-2">
                            <Input
                                value={`${window.location.origin}/f/${formSlug}`}
                                readOnly
                                className="flex-1"
                            />
                            <Button onClick={openForm} variant="secondary">
                                <ExternalLink className="w-4 h-4" />
                                Open
                            </Button>
                            <Button onClick={copyLink} variant="secondary">
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button onClick={handlePublish} className="w-full" size="lg">
                        Publish Form
                    </Button>
                )}
            </div>
        </div>
    )
}