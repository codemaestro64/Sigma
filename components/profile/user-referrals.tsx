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

interface ReferredUser {
  address: string;
  totalTrades: number;
  totalVolume: number;
  feesEarned: number;
}

// Mock data - Replace with actual API call
const mockReferredUsers: ReferredUser[] = [];

export function UserReferrals() {
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead className="text-right">Total Trades</TableHead>
            <TableHead className="text-right">Total Volume</TableHead>
            <TableHead className="text-right">Fees Earned</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockReferredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No referrals yet
              </TableCell>
            </TableRow>
          ) : (
            mockReferredUsers.map((user) => (
              <TableRow key={user.address}>
                <TableCell className="font-mono">
                  <Link
                    href={`https://testnet.ftmscan.com/address/${user.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {truncateAddress(user.address)}
                  </Link>
                </TableCell>
                <TableCell className="text-right">{user.totalTrades.toLocaleString()}</TableCell>
                <TableCell className="text-right">{user.totalVolume.toLocaleString()} ETH</TableCell>
                <TableCell className="text-right">{user.feesEarned.toLocaleString()} ETH</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 