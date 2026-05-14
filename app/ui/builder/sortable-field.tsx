import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField, useFormStore } from '@/app/store/form-store';
import { GripVertical, Trash2 } from 'lucide-react';
import { Input } from '@/app/ui/input';

interface Props {
    field: FormField;
}

export function SortableField({ field }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: field.id
    });

    const { updateField, removeField } = useFormStore();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white border border-gray-200 rounded-lg p-4 group hover:shadow-sm"
        >
            <div className="flex items-start gap-3">
                <button
                    {...attributes}
                    {...listeners}
                    className="mt-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                >
                    <GripVertical className="w-5 h-5" />
                </button>

                <div className="flex-1 space-y-3">
                    <Input
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        className="font-medium"
                        placeholder="Field Label"
                    />

                    {field.type === 'text' && (
                        <Input
                            type="text"
                            placeholder={field.placeholder || 'Enter text...'}
                            disabled
                            className="bg-gray-50"
                        />
                    )}

                    {field.type === 'email' && (
                        <Input
                            type="email"
                            placeholder="email@example.com"
                            disabled
                            className="bg-gray-50"
                        />
                    )}

                    {field.type === 'dropdown' && (
                        <div>
                            <select className="w-full p-2 border border-gray-300 rounded-md bg-gray-50" disabled>
                                <option>Select an option...</option>
                                {field.options?.map((opt, idx) => (
                                    <option key={idx}>{opt}</option>
                                ))}
                            </select>
                            <div className="mt-2 space-y-1">
                                {field.options?.map((opt, idx) => (
                                    <Input
                                        key={idx}
                                        value={opt}
                                        onChange={(e) => {
                                            const newOptions = [...(field.options || [])];
                                            newOptions[idx] = e.target.value;
                                            updateField(field.id, { options: newOptions });
                                        }}
                                        className="text-sm"
                                        placeholder={`Option ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {field.type === 'textarea' && (
                        <textarea
                            placeholder={field.placeholder || 'Type your message...'}
                            disabled
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 resize-none"
                            rows={4}
                        />
                    )}

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                            className="rounded"
                        />
                        <span className="text-gray-600">Required field</span>
                    </label>
                </div>

                <button
                    onClick={() => removeField(field.id)}
                    className="mt-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
