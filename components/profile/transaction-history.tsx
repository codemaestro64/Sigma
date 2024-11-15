'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

// Mock data - Replace with actual API call
const mockTransactions = [
  {
    hash: '0x1234...5678',
    token: 'FAIR',
    type: 'Buy',
    amount: '1,000',
    value: '$123.45',
    time: '5 mins ago',
  },
  {
    hash: '0xabcd...efgh',
    token: 'DEC',
    type: 'Sell',
    amount: '500',
    value: '$987.65',
    time: '1 hour ago',
  },
];

export function TransactionHistory() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Token</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Tx</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockTransactions.map((tx, i) => (
            <TableRow key={i}>
              <TableCell
                className={
                  tx.type === 'Buy' ? 'text-green-500' : 'text-red-500'
                }
              >
                {tx.type}
              </TableCell>
              <TableCell>{tx.token}</TableCell>
              <TableCell>{tx.amount}</TableCell>
              <TableCell>{tx.value}</TableCell>
              <TableCell>{tx.time}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}