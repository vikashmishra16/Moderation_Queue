'use client';

import { useState } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
  showReasonInput?: boolean;
  confirmType?: 'approve' | 'reject';
}

export default function ConfirmDialog({
  isOpen,
  title = 'Are you sure?',
  message,
  onConfirm,
  onCancel,
  showReasonInput = false,
  confirmType 
}: ConfirmDialogProps) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const confirmClass =
    confirmType === 'approve'
      ? 'bg-green-500 text-white'
      : 'bg-red-500 text-white';
  const confirmLabel = confirmType === 'approve' ? 'Approve' : 'Confirm';

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md shadow">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-sm mb-4">{message}</p>

        {showReasonInput && (
          <textarea
            className="w-full border border-gray-300 p-2 rounded mb-4 text-sm"
            rows={3}
            placeholder="Optional reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-1 text-sm bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(reason);
              setReason('');
            }}
            className={`px-4 py-1 text-sm rounded ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}