'use client';

import { useGlobalEvents } from '@/hooks/use-global-events';

export function GlobalEventsProvider({ children }: { children: React.ReactNode }) {
  useGlobalEvents();
  return <>{children}</>;
} 