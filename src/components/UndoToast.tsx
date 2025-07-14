'use client';

import * as Toast from '@radix-ui/react-toast';
import { useState } from 'react';

export default function UndoToast({
  message,
  onUndo,
}: {
  message: string;
  onUndo: () => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className="bg-gray-800 text-white px-4 py-2 rounded shadow-lg flex items-center justify-between gap-4"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="text-sm">{message}</Toast.Title>
        <button
          className="text-blue-400 text-sm underline"
          onClick={() => {
            onUndo();
            setOpen(false);
          }}
        >
          Undo
        </button>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-4 right-4 z-50" />
    </Toast.Provider>
  );
}
