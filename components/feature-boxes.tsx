'use client';

import { Shield, Users, Scale } from 'lucide-react';

const features = [
  {
    title: 'No PvP',
    description: 'Everyone buys at the same fair price. No insider prices, no private sales.',
    icon: Shield,
  },
  {
    title: 'Anti Bag Holding',
    description: 'Tokens are received instantly and will remain at the same price until migration. Where there will be great support from holders and liquidity.',
    icon: Users,
  },
  {
    title: 'Fair Distribution',
    description: 'Buy limits prevent market manipulation and ensure equitable distribution.',
    icon: Scale,
  },
];

export function FeatureBoxes() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[rgba(25,25,50,0.9)] p-6 rounded-lg backdrop-blur-md border border-[rgba(255,255,255,0.1)] hover:border-cyan-400/50 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-cyan-400/10 group-hover:bg-cyan-400/20 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-400">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 