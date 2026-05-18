"use client";

import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useFormStore } from "@/app/store/form-store";
import { Input } from "@/app/ui/input";
import { FieldPalette } from "@/app/ui/builder/field-palette";
import { SortableField } from "@/app/ui/builder/sortable-field";
import { useState } from "react";
import { PublishModal } from "@/app/ui/builder/publish-modal";
import { PublishSection } from "@/app/ui/builder/publish-section";

export function FormBuilder() {
  const {
    formTitle,
    formFields,
    formSlug,
    setFormSlug,
    setFormTitle,
    reorderFields,
  } = useFormStore();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [shareURL, setShareURL] = useState("");

  // Reroder the fields after drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = formFields.findIndex((field) => field.id === active.id);
      const newIndex = formFields.findIndex((field) => field.id === over.id);

      reorderFields(arrayMove(formFields, oldIndex, newIndex));
    }
  };

  // Show publish modal when publish button is clicked
  const handlePublish = () => {
    if (formFields.length === 0) {
      alert("Please add at least one field to your form");
      return;
    }

    const labels = formFields.map((field) => field.label.trim().toLowerCase());
    const emptyLabelCount = labels.filter((label) => label === "").length;

    if (emptyLabelCount > 0) {
      alert("Please give each field a unique label before publishing.");
      return;
    }

    const duplicateLabels = labels.filter(
      (label, index) => labels.indexOf(label) !== index,
    );

    if (duplicateLabels.length > 0) {
      const uniqueDuplicates = Array.from(new Set(duplicateLabels));
      alert(
        `Please make each field label unique before publishing. Duplicate labels: ${uniqueDuplicates.join(", ")}`,
      );
      return;
    }

    setShowPublishModal(true);
  };

  const handleClosePublishSection = () => {
    setFormSlug("");
    setShareURL("");
  };

  // Handle form publish after PIN confirmation
  const handlePublishConfirm = async (pin: string) => {
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          fields: formFields,
          pin: pin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to publish form. Please try again.");
        return;
      }

      setShareURL(data.form.shareUrl);
      setFormSlug(data.form.slug);
    } catch (error) {
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setShowPublishModal(false);
    }
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
      <div className="flex-1 h-full flex overflow-hidden">
        <div className="w-64 border-r p-4 overflow-y-auto">
          <FieldPalette />
        </div>

        <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
            {formFields.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <p className="text-lg">
                  Click fields from the left to build your form
                </p>
              </div>
            ) : (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={formFields.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
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
        <PublishSection
          shareURL={shareURL}
          formSlug={formSlug}
          onPublish={handlePublish}
          onClose={handleClosePublishSection}
        />
      </div>

      {showPublishModal && (
        <PublishModal
          onPublishConfirm={handlePublishConfirm}
          onCancel={() => setShowPublishModal(false)}
        />
      )}
    </div>
  );
}
