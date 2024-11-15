'use client';

import { Check, X } from 'lucide-react';
import styles from '@/styles/ComparisonTable.module.css';

const comparisonData = [
  {
    feature: 'Equal Pricing',
    sigmaFun: 'Same price for all from day one',
    others: 'First in always wins, no time for research',
  },
  {
    feature: 'Liquidity-Based Launch',
    sigmaFun: 'Everyone is ready to "Diamond Hand"',
    others: 'Everyone ready to sell on launch',
  },
  {
    feature: 'Fair Buying Limits',
    sigmaFun: 'Caps to prevent market manipulation',
    others: 'No limits; whales dominate market',
  },
  {
    feature: 'Instant Token Access',
    sigmaFun: 'Immediate tokens in your wallet',
    others: 'Tokens locked or unpredictably restricted',
  },
  {
    feature: 'No PVP Scramble',
    sigmaFun: 'Fair access; no first-in rush',
    others: 'PVP trading; users rush to buy/sell',
  },
  {
    feature: 'Option to Sell Back',
    sigmaFun: 'Sell back at no loss for a 1% tx fee',
    others: 'Locked in; bag holding at a loss',
  },
  {
    feature: 'Community-Centric Model',
    sigmaFun: 'Equal opportunity and valuation',
    others: 'Preferential access undermines trust',
  },
];

export function ComparisonTable() {
  return (
    <div className={styles.comparisonTableContainer}>
      <h2 className="text-3xl font-bold text-center mb-8 text-cyan-400">Why Sigma.Fun Stands Out</h2>
      <table className={styles.comparisonTable}>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Sigma.Fun</th>
            <th>Other Platforms</th>
          </tr>
        </thead>
        <tbody>
          {comparisonData.map((item, index) => (
            <tr key={index}>
              <td>{item.feature}</td>
              <td>
                <div className={styles.iconContainer}>
                  <Check className={`h-5 w-5 ${styles.checkIcon}`} />
                  <span>{item.sigmaFun}</span>
                </div>
              </td>
              <td>
                <div className={styles.iconContainer}>
                  <X className={`h-5 w-5 ${styles.xIcon}`} />
                  <span>{item.others}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 