"use client";

import { useState } from "react";
import { Input } from "@/app/ui/input";
import { Button } from "@/app/ui/button";
import { Database, AlertCircle } from "lucide-react";
import { redirect, useRouter } from "next/navigation";

export function EntryPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const isPinComplete = pin.every((digit) => digit !== "");

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!slug.trim()) {
      setError("Please enter your dashboard slug");
      return;
    }

    const pinValue = pin.join("");
    if (pinValue.length !== 4) {
      setError("Please enter your 4-digit PIN");
      return;
    }

    const response = await fetch(`/api/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug: slug.trim(), pin: pinValue }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(
        data.error || "Invalid dashboard slug or PIN. Please try again.",
      );
      setPin(["", "", "", ""]);
      setTimeout(() => {
        document.getElementById("pin-0")?.focus();
      }, 100);
      return;
    }

    const redirectUrl = data.redirectUrl || `/dashboard/${slug.trim()}`;
    router.refresh();
    redirect(redirectUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Database className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">
            Access Dashboard
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Enter your dashboard slug and PIN to view submissions
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Dashboard Slug
              </label>
              <Input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="your-form-slug-abc12"
                className="font-mono"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                This is the unique identifier from your form URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">PIN</label>
              <div className="flex gap-3 justify-center">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-14 h-14 text-center text-2xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      error
                        ? "border-red-500 bg-red-50 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!slug.trim() || !isPinComplete}
            >
              Access Dashboard
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Demo:</strong> Create a form in the builder, then use the
              generated slug and PIN to access this dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
