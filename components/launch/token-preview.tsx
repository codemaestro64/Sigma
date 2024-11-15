'use client';

import { Card } from '@/components/ui/card';
import { TokenCardContent } from '@/components/tokens/token-card-content';
import { cn } from "@/lib/utils";

interface TokenPreviewProps {
  name: string;
  symbol: string;
  icon?: string;
  description: string;
}

export function TokenPreview({ name, symbol, icon, description }: TokenPreviewProps) {
  const previewToken = {
    name,
    symbol,
    icon,
    description,
  };

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#22ff66] via-[#9c40ff] to-[#22ff66] rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-500 animate-gradient-x"></div>
      <Card className="relative bg-gray-900 transition-all duration-200 ease-in-out hover:scale-[1.02]">
        <TokenCardContent token={previewToken} isPreview={true} />
      </Card>
    </div>
  );
}
