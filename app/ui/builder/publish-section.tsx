"use client";

import { useState } from "react";
import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";
import { ExternalLink, Copy, Check } from "lucide-react";

interface PublishSectionProps {
  shareURL: string;
  formSlug: string;
  onPublish: () => void;
}

export function PublishSection({
  shareURL,
  formSlug,
  onPublish,
}: PublishSectionProps) {
  const [copied, setCopied] = useState<"form" | "dashboard" | null>(null);
  const isPublished = formSlug !== "";

  const openForm = () => {
    window.open(shareURL, "_blank");
  };

  const copyFormLink = () => {
    navigator.clipboard.writeText(shareURL);
    setCopied("form");
    setTimeout(() => setCopied(null), 2000);
  };

  const copyDashboardLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/dashboard`);
    setCopied("dashboard");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      {isPublished ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
          <div>
            <p className="text-green-800 font-semibold mb-3">
              Form Published! 🎉
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Share Form URL (for customers)
                </label>
                <div className="flex items-center gap-2">
                  <Input value={shareURL} readOnly className="flex-1 text-sm" />
                  <Button onClick={openForm} variant="secondary" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button onClick={copyFormLink} variant="secondary" size="sm">
                    {copied === "form" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dashboard Slug
                </label>
                <div className="flex items-center gap-2">
                  <Input value={formSlug} readOnly className="flex-1 text-sm" />
                  <Button
                    onClick={copyDashboardLink}
                    variant="secondary"
                    size="sm"
                  >
                    {copied === "dashboard" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Button onClick={onPublish} className="w-full" size="lg">
          Publish Form
        </Button>
      )}
    </>
  );
}
