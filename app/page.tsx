'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ComparisonTable } from '@/components/comparison-table';
import { PriceCharts } from '@/components/price-charts';
import { FeatureBoxes } from '@/components/feature-boxes';
import WordPullUp from '@/components/ui/word-pull-up';
import BlurIn from '@/components/ui/blur-in';
import AnimatedGradientText from '@/components/ui/animated-gradient-text';
import { ArrowRight } from "lucide-react";
import RetroGrid from "@/components/ui/retro-grid";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { Footer } from '@/components/layout/footer';
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden flex flex-col">
      <AnimatedGridPattern 
        className={cn(
          "fixed top-0 left-0 right-0 bottom-0 z-0 opacity-50",
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
        numSquares={45}
        maxOpacity={0.3}
        duration={10}
        repeatDelay={0}
      />
      
      <div className="relative z-10 flex-grow">
        <div className="flex flex-col items-center justify-center py-8 md:py-12 px-4">
          <div className="max-w-4xl text-center space-y-6 md:space-y-8 mb-12 md:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">
              Level the Playing Field
            </h1>
            <AnimatedGradientText>
              <WordPullUp
                className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-primary/50"
                words="Launch Your Token Fairly and Transparently"
                delayMultiple={4}
              />
            </AnimatedGradientText>

            <BlurIn
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground px-4 md:px-0"
              word="A revolutionary launch platform where everyone gets in at the same price, with built-in safety, fair buying limits, and a no-risk exit."
              delayMultiple={8}
            />

            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/launch" className="flex items-center justify-center">
                  Launch Token <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/explore">Explore Tokens</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-0 space-y-12 md:space-y-16">
          <FeatureBoxes />
          <PriceCharts />
          <ComparisonTable />
        </div>
      </div>

      <Footer />
    </main>
  );
}
