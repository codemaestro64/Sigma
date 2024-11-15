"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TokenDetailsProps {
  token: any; // Replace 'any' with a proper type definition for your token
}

export function TokenDetails({ token }: TokenDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{token.name} ({token.symbol})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          {token.icon && (
            <Image src={token.icon} alt={token.name} width={64} height={64} className="rounded-full" />
          )}
          <div>
            <p><strong>Address:</strong> {token.address}</p>
            <p><strong>Description:</strong> {token.description}</p>
          </div>
        </div>
        <div>
          <p><strong>Website:</strong> <a href={token.website} target="_blank" rel="noopener noreferrer">{token.website}</a></p>
          {/* Add more token details here */}
        </div>
      </CardContent>
    </Card>
  );
}
