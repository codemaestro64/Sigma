"use client";

import * as React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { Navigation } from "./navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Header() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-6" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/BlueLogo.png"
                alt="Fair Launch Logo"
                width={160}
                height={10}
                className="h-auto"
              />
            </Link>
            <div className="hidden ml-10 lg:block">
              <Navigation />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <Button 
                            onClick={openConnectModal} 
                            variant="default"
                            className="px-2 py-2 h-10"
                          >
                            Connect Wallet
                          </Button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <Button onClick={openChainModal} variant="destructive">
                            Wrong network
                          </Button>
                        );
                      }

                      return (
                        <div className="flex items-center gap-1">
                          <Button
                            onClick={openChainModal}
                            variant="outline"
                            className="hidden sm:flex px-2 py-2 h-10"
                          >
                            {chain.hasIcon && (
                              <div
                                className="mr-2"
                                style={{
                                  background: chain.iconBackground,
                                  width: 12,
                                  height: 12,
                                  borderRadius: 999,
                                  overflow: 'hidden',
                                }}
                              >
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    style={{ width: 12, height: 12 }}
                                  />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </Button>

                          <Button 
                            onClick={openAccountModal} 
                            variant="outline"
                            className="px-2 py-2 h-10"
                          >
                            {account.displayName}
                            {account.displayBalance
                              ? ` (${account.displayBalance})`
                              : ''}
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6 text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <Navigation onItemClick={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
