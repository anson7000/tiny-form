import { create } from 'zustand';

export type FieldType = 'text' | 'email' | 'dropdown' | 'textarea';

export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    options?: string[];
    required: boolean;
}

interface FormState {
    // Form Builder
    formTitle: string;
    formPin: string;
    formSlug: string;
    formFields: FormField[];
    selectedFieldId: string | null;


    // Actions
    setFormTitle: (title: string) => void;
    setFormPin: (pin: string) => void;
    setFormSlug: (slug: string) => void;
    addField: (field: FormField) => void;
    updateField: (id: string, updates: Partial<FormField>) => void;
    removeField: (id: string) => void;
    reorderFields: (fields: FormField[]) => void;
    setSelectedFieldId: (id: string | null) => void;
}

export const useFormStore = create<FormState>((set) => ({
    formTitle: 'Untitled Form',
    formPin: '',
    formSlug: '',
    formFields: [],
    selectedFieldId: null,

    setFormTitle: (title) => set({ formTitle: title }),
    setFormPin: (pin) => set({ formPin: pin }),
    setFormSlug: (slug) => set({ formSlug: slug }),
    addField: (field) => set((state) => ({
        formFields: [...state.formFields, field]
    })),
    updateField: (id, updates) => set((state) => ({
        formFields: state.formFields.map((field) =>
            field.id === id ? { ...field, ...updates } : field
        )
    })),
    removeField: (id) => set((state) => ({
        formFields: state.formFields.filter((field) => field.id !== id),
        selectedFieldId: state.selectedFieldId === id ? null : state.selectedFieldId
    })),
    reorderFields: (fields) => set({ formFields: fields }),
    setSelectedFieldId: (id) => set({ selectedFieldId: id }),
}));

