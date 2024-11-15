'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import Image from 'next/image';

interface ReferredLaunch {
  token: {
    address: string;
    name: string;
    symbol: string;
    icon: string;
  };
  creator: string;
  totalTrades: number;
  totalVolume: number;
  feesEarned: number;
}

// Mock data - Replace with actual API call
const mockReferredLaunches: ReferredLaunch[] = [];

export function LaunchReferrals() {
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead className="text-right">Total Trades</TableHead>
            <TableHead className="text-right">Total Volume</TableHead>
            <TableHead className="text-right">Fees Earned</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockReferredLaunches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No launch referrals yet
              </TableCell>
            </TableRow>
          ) : (
            mockReferredLaunches.map((launch) => (
              <TableRow key={launch.token.address}>
                <TableCell>
                  <Link
                    href={`/tokens/${launch.token.address}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                      <Image
                        src={launch.token.icon}
                        alt={launch.token.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div>{launch.token.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {launch.token.symbol}
                      </div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="font-mono">
                  <Link
                    href={`https://testnet.ftmscan.com/address/${launch.creator}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {truncateAddress(launch.creator)}
                  </Link>
                </TableCell>
                <TableCell className="text-right">{launch.totalTrades.toLocaleString()}</TableCell>
                <TableCell className="text-right">{launch.totalVolume.toLocaleString()} ETH</TableCell>
                <TableCell className="text-right">{launch.feesEarned.toLocaleString()} ETH</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 