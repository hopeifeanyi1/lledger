//src/app/providers.tsx
'use client'

import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster richColors position="top-right" />
      {children}
    </>
  );
}