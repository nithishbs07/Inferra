import { ReactNode } from "react";

interface TabContainerProps {
  children: ReactNode;
}

export function TabContainer({ children }: TabContainerProps) {
  return (
    <div className="flex h-full w-full flex-col rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-1)] shadow-sm">
      {children}
    </div>
  );
}
