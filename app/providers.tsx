"use client";

import { SoundProvider } from "@web-kits/audio/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SoundProvider>{children}</SoundProvider>;
}
