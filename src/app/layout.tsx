// src/app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { Providers } from './providers'; // ✅ Wraps Redux

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
