import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WalletProvider } from "@/components/providers/wallet-provider";
import { Header } from "@/components/layout/header";
import "@rainbow-me/rainbowkit/styles.css";
import '@/lib/fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { GlobalEventsProvider } from '@/components/providers/global-events-provider';
import { Toaster } from "@/components/ui/toaster";
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sigma.Fun",
  description: "Launch your token fairly and transparently, like a real Chad",
  icons: {
    icon: [
      { url: "/images/favicon/favicon.ico" },
      { url: "/images/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/images/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-gray-900 to-gray-800`}>
        <WalletProvider>
          <div className="bg-gradient-to-r from-blue-900 to-black shadow-md">
            <Header />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <main className="py-8">
              <GlobalEventsProvider>
                {children}
              </GlobalEventsProvider>
            </main>
          </div>
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  );
}
