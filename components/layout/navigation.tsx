"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Compass, Rocket, User } from "lucide-react";
import { MobileReferral } from './mobile-referral';
import { motion } from "framer-motion";

const navigation = [
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Launch", href: "/launch", icon: Rocket },
  { name: "Profile", href: "/profile", icon: User },
] as const;

interface NavigationProps {
  onItemClick?: () => void;
}

export function Navigation({ onItemClick }: NavigationProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row lg:items-center lg:gap-2 pt-6 lg:pt-0">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "group relative flex items-center gap-2 rounded-md px-2 py-1.5 text-base font-medium text-white/50 transition-all duration-300",
              "hover:text-white",
              pathname === item.href && "text-white font-semibold"
            )}
          >
            <item.icon 
              className={cn(
                "h-5 w-5 transition-all duration-300 group-hover:scale-110",
                pathname === item.href ? "text-white" : "text-white/70"
              )} 
            />
            <span className="relative">
              {item.name}
              {pathname === item.href && (
                <motion.div
                  layoutId="navigation-underline"
                  className="absolute -bottom-0.75 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400/0 via-cyan-400 to-cyan-400/0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 600,
                    damping: 20
                  }}
                />
              )}
            </span>
          </Link>
        ))}
      </div>
      <div className="lg:hidden mt-auto">
        <MobileReferral />
      </div>
    </div>
  );
}