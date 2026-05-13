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

export interface Submission {
    id: string;
    timestamp: string;
    data: Record<string, string>;
    status: 'unread' | 'read' | 'replied';
    repliedAt?: string;
}

interface FormState {
    // Form Builder
    formTitle: string;
    formFields: FormField[];
    selectedFieldId: string | null;
    formSlug: string;
    isPublished: boolean;

    // Submissions
    submissions: Submission[];

    // Authentication
    isAuthenticated: boolean;

    // Actions
    setFormTitle: (title: string) => void;
    addField: (field: FormField) => void;
    updateField: (id: string, updates: Partial<FormField>) => void;
    removeField: (id: string) => void;
    reorderFields: (fields: FormField[]) => void;
    setSelectedFieldId: (id: string | null) => void;
    publishForm: () => void;

    // Submission actions
    addSubmission: (data: Record<string, string>) => void;
    updateSubmissionStatus: (id: string, status: Submission['status']) => void;

    // Auth actions
    authenticate: () => void;
    logout: () => void;
}

export const useFormStore = create<FormState>((set) => ({
    formTitle: 'Untitled Form',
    formFields: [],
    selectedFieldId: null,
    formSlug: '',
    isPublished: false,
    isAuthenticated: false,

    submissions: [
        // Mock data
        {
            id: '1',
            timestamp: '2026-05-13T10:30:00',
            data: {
                name: 'Alice Johnson',
                email: 'alice@example.com',
                message: 'I would like to order a chocolate cake for my daughter\'s birthday party.'
            },
            status: 'unread'
        },
        {
            id: '2',
            timestamp: '2026-05-13T11:45:00',
            data: {
                name: 'Bob Smith',
                email: 'bob@example.com',
                message: 'Do you offer gluten-free options?'
            },
            status: 'read'
        },
        {
            id: '3',
            timestamp: '2026-05-13T14:20:00',
            data: {
                name: 'Carol White',
                email: 'carol@example.com',
                message: 'Looking for a wedding cake consultation. Available next week?'
            },
            status: 'replied',
            repliedAt: '2026-05-13T15:00:00'
        }
    ],

    setFormTitle: (title) => set({ formTitle: title }),

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

    publishForm: () => set((state) => ({
        isPublished: true,
        formSlug: state.formTitle.toLowerCase().replace(/\s+/g, '-').slice(0, 20) + '-' + Math.random().toString(36).slice(2, 7)
    })),

    addSubmission: (data) => set((state) => ({
        submissions: [
            {
                id: Math.random().toString(36).slice(2),
                timestamp: new Date().toISOString(),
                data,
                status: 'unread' as const
            },
            ...state.submissions
        ]
    })),

    updateSubmissionStatus: (id, status) => set((state) => ({
        submissions: state.submissions.map((sub) =>
            sub.id === id
                ? {
                    ...sub,
                    status,
                    repliedAt: status === 'replied' ? new Date().toISOString() : sub.repliedAt
                }
                : sub
        )
    })),

    authenticate: () => set({ isAuthenticated: true }),

    logout: () => set({ isAuthenticated: false })
}));

