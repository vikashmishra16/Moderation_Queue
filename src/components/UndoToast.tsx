'use client';

import * as Toast from '@radix-ui/react-toast';
import { useEffect, useState } from 'react';

export default function UndoToast({
  message,
  onUndo,
  timestamp,
}: {
  message: string;
  onUndo: () => void;
  timestamp: number;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (timestamp) {
      setOpen(true);
    }
  }, [timestamp]);

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded shadow-lg flex items-center justify-between gap-4"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="text-sm">{message}</Toast.Title>
        <button
          className="text-green-700 font-semibold text-sm underline"
          onClick={() => {
            onUndo();
            setOpen(false);
          }}
        >
          Undo
        </button>
      </Toast.Root>
      <Toast.Viewport className="fixed top-4 right-4 z-50" />
    </Toast.Provider>
  );
}
