"use client";

import { useState } from "react";
import { Button } from "@/app/ui/button";
import { Lock, AlertCircle } from "lucide-react";

interface PublishModalProps {
  onPublishConfirm: (pin: string) => void;
  onCancel: () => void;
}

export function PublishModal({
  onCancel,
  onPublishConfirm,
}: PublishModalProps) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const [error, setError] = useState("");

  const isPinComplete = pin.every((digit) => digit !== "");
  const isConfirmComplete = confirmPin.every((digit) => digit !== "");

  // Handle PIN input changes and auto-focus next input
  const handlePinChange = (
    index: number,
    value: string,
    isConfirm: boolean = false,
  ) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const targetPin = isConfirm ? confirmPin : pin;
    const setTargetPin = isConfirm ? setConfirmPin : setPin;

    const newPin = [...targetPin];
    newPin[index] = value;
    setTargetPin(newPin);

    if (value && index < 3) {
      const nextInput = document.getElementById(
        `${isConfirm ? "confirm-" : ""}pin-${index + 1}`,
      );
      nextInput?.focus();
    }
  };

  // Handle backspace to auto-focus previous input
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    isConfirm: boolean = false,
  ) => {
    const targetPin = isConfirm ? confirmPin : pin;
    if (e.key === "Backspace" && !targetPin[index] && index > 0) {
      const prevInput = document.getElementById(
        `${isConfirm ? "confirm-" : ""}pin-${index - 1}`,
      );
      prevInput?.focus();
    }
  };

  // Move to confirm step if PIN is complete
  const handleContinue = () => {
    if (pin.every((d) => d !== "")) {
      setError("");
      setStep("confirm");
      setTimeout(() => {
        document.getElementById("confirm-pin-0")?.focus();
      }, 100);
    }
  };

  // Handle form submission and validate PINs
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pinValue = pin.join("");
    const confirmValue = confirmPin.join("");

    if (pinValue !== confirmValue) {
      setError("PINs do not match. Please try again.");
      setConfirmPin(["", "", "", ""]);
      setTimeout(() => {
        document.getElementById("confirm-pin-0")?.focus();
      }, 100);
      return;
    }

    onPublishConfirm(pinValue);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Set Your PIN</h2>
        <p className="text-gray-600 text-center mb-8">
          {step === "enter"
            ? "Create a 4-digit PIN to protect your form dashboard"
            : "Confirm your PIN"}
        </p>

        <form onSubmit={handleSubmit}>
          {step === "enter" ? (
            <>
              <div className="flex gap-3 justify-center mb-6">
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
                    className="w-14 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={onCancel}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleContinue}
                  className="flex-1"
                  disabled={!isPinComplete}
                >
                  Continue
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-3 justify-center mb-6">
                {confirmPin.map((digit, index) => (
                  <input
                    key={index}
                    id={`confirm-pin-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handlePinChange(index, e.target.value, true)
                    }
                    onKeyDown={(e) => handleKeyDown(index, e, true)}
                    className={`w-14 h-14 text-center text-2xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      error
                        ? "border-red-500 bg-red-50 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => {
                    setStep("enter");
                    setConfirmPin(["", "", "", ""]);
                    setError("");
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!isConfirmComplete}
                >
                  Publish Form
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
