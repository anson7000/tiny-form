import { useFormStore, FormField, FieldType } from "@/app/store/form-store";
import { Type, Mail, ChevronDown, AlignLeft } from "lucide-react";

const fieldTypes: Array<{
  type: FieldType;
  label: string;
  icon: React.ReactNode;
}> = [
  { type: "text", label: "Text Field", icon: <Type className="w-5 h-5" /> },
  { type: "email", label: "Email Field", icon: <Mail className="w-5 h-5" /> },
  {
    type: "dropdown",
    label: "Dropdown",
    icon: <ChevronDown className="w-5 h-5" />,
  },
  {
    type: "textarea",
    label: "Message",
    icon: <AlignLeft className="w-5 h-5" />,
  },
];

export function FieldPalette() {
  const addField = useFormStore((state) => state.addField);

  // Handle adding a new field when a field type button is clicked
  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: Math.random().toString(36).slice(2),
      type,
      label:
        type === "text"
          ? "Text Field"
          : type === "email"
            ? "Email"
            : type === "dropdown"
              ? "Dropdown"
              : "Message",
      placeholder: type === "textarea" ? "Type your message here..." : "",
      options:
        type === "dropdown" ? ["Option 1", "Option 2", "Option 3"] : undefined,
      required: false,
    };

    addField(newField);
  };

  return (
    <div>
      <h3 className="font-semibold mb-3 text-sm text-gray-600">FIELD TYPES</h3>
      <div className="space-y-2">
        {fieldTypes.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => handleAddField(type)}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
          >
            <div className="text-gray-600">{icon}</div>
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
