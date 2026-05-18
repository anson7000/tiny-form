"use client";

import { FormField } from "@/app/store/form-store";
import { useState } from "react";
import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

interface PublicFormProps {
  formSlug: string;
  formTitle: string;
  formFields: FormField[];
}

export function PublicForm({
  formSlug,
  formTitle,
  formFields,
}: PublicFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    const missingFields = formFields
      .filter((field) => field.required && !formData[field.id])
      .map((field) => field.label);

    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.join(", ")}`);
      return;
    }

    // Convert field IDs to labels for submission
    const submissionData: Record<string, string> = {};
    formFields.forEach((field) => {
      submissionData[field.label] = formData[field.id] || "";
    });

    // Submit data to API
    const response = await fetch(`/api/forms/${formSlug}/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: submissionData,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to submit form. Please try again.");
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
          <p className="text-gray-600 mb-6">
            Your submission has been received.
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{formTitle}</h1>
            <p className="text-gray-600">Please fill out the form below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 overeflow-y-auto">
            {formFields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-semibold mb-2">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {field.type === "text" && (
                  <Input
                    type="text"
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                )}

                {field.type === "email" && (
                  <Input
                    type="email"
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    placeholder="email@example.com"
                    required={field.required}
                  />
                )}

                {field.type === "dropdown" && (
                  <select
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    required={field.required}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an option...</option>
                    {field.options?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === "textarea" && (
                  <textarea
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                )}
              </div>
            ))}

            <Button type="submit" className="w-full" size="lg">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
