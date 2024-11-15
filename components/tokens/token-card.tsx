'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { useTokenPrice } from "@/hooks/use-token-price";
import { useMigrationProgress } from "@/hooks/use-migration-progress";
import { Token } from '@/lib/types';
import { TokenCardContent } from './token-card-content';
import { BorderBeam } from "@/components/ui/border-beam";

interface TokenCardProps {
  token: Token;
}

export function TokenCard({ token }: TokenCardProps) {
  const { priceInEth } = useTokenPrice(token.address);
  const { migrationProgress, isLoading, isError } = useMigrationProgress(token.address);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading token data</div>;

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#22ff66] via-[#9c40ff] to-[#22ff66] rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-500 animate-gradient-x"></div>
        <Card className="overflow-hidden relative transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
          <Link href={`/tokens/${token.address}`} className="block relative z-20">
            <TokenCardContent 
              token={{ ...token, migrationProgress }} 
              priceInEth={priceInEth} 
            />
        </Link>
      </Card>
    </div>
  );
}
