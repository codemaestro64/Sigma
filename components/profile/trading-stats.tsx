'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function TradingStats() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Trading Volume by Token</h3>
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span>FAIR</span>
              <span>$50,000</span>
            </div>
            <Progress value={75} />
          </div>
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span>DEC</span>
              <span>$30,000</span>
            </div>
            <Progress value={45} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Trading Statistics</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Trades</span>
            <span className="font-medium">156</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Average Trade Size</span>
            <span className="font-medium">$521.45</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Most Traded Token</span>
            <span className="font-medium">FAIR</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Success Rate</span>
            <span className="font-medium text-green-500">68%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}