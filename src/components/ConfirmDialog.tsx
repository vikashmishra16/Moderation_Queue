"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
  showReasonInput?: boolean;
  confirmType?: "approve" | "reject";
}

export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  message,
  onConfirm,
  onCancel,
  showReasonInput = false,
  confirmType = "approve",
}: ConfirmDialogProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const confirmClass =
    confirmType === "approve"
      ? "bg-green-500 hover:bg-green-600"
      : "bg-red-500 hover:bg-red-600";
  const confirmLabel = confirmType === "approve" ? "Approve" : "Confirm";
  const Icon = confirmType === "approve" ? CheckCircle : XCircle;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg animate-scaleIn transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <Icon
            className={`w-6 h-6 ${
              confirmType === "approve" ? "text-green-600" : "text-red-600"
            }`}
          />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <p className="text-gray-600 text-sm mb-4">{message}</p>

        {showReasonInput && (
          <textarea
            className="w-full border border-gray-300 p-2 rounded mb-4 text-sm focus:ring-2 focus:ring-blue-200"
            rows={3}
            placeholder="Optional reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 text-sm rounded bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(reason);
              setReason("");
            }}
            className={`px-4 py-1.5 text-sm rounded text-white ${confirmClass} transition`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
