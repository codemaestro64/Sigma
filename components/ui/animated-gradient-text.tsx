import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export default function AnimatedGradientText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex animate-gradient-x bg-gradient-to-r from-[#22ff66] via-[#60a5fa] to-[#9c40ff] bg-[length:200%_auto] bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}
