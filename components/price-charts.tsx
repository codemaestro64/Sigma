'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
);

const labels = Array.from({ length: 24 }, (_, i) => '');

const traditionalData = {
  labels,
  datasets: [
    {
      data: [10, 12, 35, 45, 80, 100, 60, 40, 20, 15, 10, 8, 5, 4, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1],
      borderColor: '#ff0066',
      backgroundColor: 'rgba(255, 0, 102, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
    },
  ],
};

const sigmaData = {
  labels,
  datasets: [
    {
      data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
      borderColor: '#00ff88',
      backgroundColor: 'rgba(0, 255, 136, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
};

export function PriceCharts() {
  return (
    <div className="w-full max-w-5xl mx-auto my-16">
      <h2 className="text-3xl font-bold text-center mb-8 text-cyan-400">
        Why the Current PvP Bonding Curve Model Sucks
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-[rgba(25,25,50,0.9)] p-6 rounded-lg backdrop-blur-md">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-muted-foreground mb-3">PvP</div>
            <h3 className="text-xl font-semibold text-[#ff0066]">
              Traditional PVP Launch
            </h3>
          </div>
          <div className="h-[200px]">
            <Line options={chartOptions} data={traditionalData} />
          </div>
          <div className="mt-8 text-sm text-muted-foreground space-y-2">
            <p className="text-center font-medium mb-4">
              Pump and dump pattern with high initial volatility
            </p>
            <p className="text-sm leading-relaxed">
              In the traditional PvP launch model, early participants engage in <strong>aggressive trading</strong>, 
              leading to <strong><em>extreme price volatility</em></strong> with sharp price increases followed by 
              rapid declines. This "<strong>pump and dump</strong>" behavior creates <em>high risk for users</em>, as 
              only a few benefit, often at the expense of others.
            </p>
            <p className="text-sm leading-relaxed mt-4">
              This model fosters <strong>competition over collaboration</strong>, leading to a 
              <em>risky, zero-sum environment</em> where participants' gains come from others' losses. This setup 
              typically results in a <strong>loss of trust and value</strong> for long-term holders.
            </p>
          </div>
        </div>
        <div className="bg-[rgba(25,25,50,0.9)] p-6 rounded-lg backdrop-blur-md">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-muted-foreground mb-3">PvC</div>
            <h3 className="text-xl font-semibold text-[#00ff88]">
              Sigma.Fun Launch
            </h3>
          </div>
          <div className="h-[200px]">
            <Line options={chartOptions} data={sigmaData} />
          </div>
          <div className="mt-8 text-sm text-muted-foreground space-y-2">
            <p className="text-center font-medium mb-4">
              Stable price during launch, followed by organic growth
            </p>
            <p className="text-sm leading-relaxed">
              The Sigma model represents a shift towards a <strong>Player vs. Collective (PvC)</strong> approach. 
              Participants join a <strong>collective</strong>, aiming for <em>sustainable, long-term growth</em> that 
              benefits <strong>everyone involved</strong>. Instead of volatility, the launch is designed for 
              <em>stability</em>, allowing <strong>organic growth</strong> as the project gains traction.
            </p>
            <p className="text-sm leading-relaxed mt-4">
              This approach <strong>aligns individual interests with collective well-being</strong>, creating a 
              <em>fair and balanced environment</em>. Participants' success is tied to the <strong>collective's 
              growth</strong>, fostering a supportive community where <em>everyone can benefit</em> from the value 
              created together.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-cyan-400">
          Why Memes Are the Future of Crypto—and How Sigma.fun Is Leading the Way
        </h2>
        <div className="bg-[rgba(25,25,50,0.9)] p-8 rounded-lg backdrop-blur-md">
          <p className="text-lg leading-relaxed text-muted-foreground">
            <strong>Memes</strong> aren't just tokens—they're <em>mini revolutions</em>, 
            <strong>digital tribes</strong>, and <em>cultural movements</em>. The 
            <strong>meme economy</strong> is thriving because people crave 
            <em>connection, fun, and a bit of rebellion</em> in a world that's all charts and code.
          </p>
          
          <p className="text-lg leading-relaxed text-muted-foreground mt-4">
            At <strong>Sigma.fun</strong>, we're here to fuel that fire. Our 
            <strong>fair launch model</strong> takes the <em>best parts of meme culture</em>—
            <strong>community, excitement, and an organic vibe</strong>—and levels up by creating a 
            <em>fair, collective experience</em>. <strong>No insider games or PvP dumps</strong>. Just pure, 
            <em>bottom-up growth</em> where everyone gets a chance to thrive together.
          </p>

          <p className="text-lg leading-relaxed text-muted-foreground mt-4">
            <strong>Sigma.fun</strong> isn't just another token tool; it's a 
            <strong>launchpad for the next generation of meme movements</strong>. Join us, and let's keep 
            <em>memes at the center of the crypto world</em>, building <strong>cults and communities</strong> that 
            <em>actually last</em>.
          </p>
        </div>
      </div>
    </div>
  );
} 