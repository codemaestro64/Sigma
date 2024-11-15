'use client';

import { Card } from '@/components/ui/card';
import { BarChart2, ArrowLeftRight, Users, Rocket } from 'lucide-react';

export function UserStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-[calc(100vw-2rem)]">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <BarChart2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-md font-bold">15</h3>
            <p className="text-xs text-muted-foreground">Tokens Held</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <ArrowLeftRight className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-md font-bold truncate">$98,765.43</h3>
            <p className="text-xs text-muted-foreground">Total Volume Traded</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-md font-bold">0</h3>
            <p className="text-xs text-muted-foreground">Users Referred</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Rocket className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-md font-bold">0</h3>
              <p className="text-xs text-muted-foreground">Launches Referred</p>
          </div>
        </div>
      </Card>
    </div>
  );
}