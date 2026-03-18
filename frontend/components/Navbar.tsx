"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Wallet, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar = () => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  return (
    <nav className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-[150px]">
              {/* Logo for Light Mode (Dark Text) */}
              <Image
                src="/logo_light.svg"
                alt="Fhenix Logo"
                fill
                className="object-contain theme-logo-light"
                priority
              />
              {/* Logo for Dark Mode (White Text) */}
              <Image
                src="/fhenix_logo_dark.svg"
                alt="Fhenix Logo"
                fill
                className="object-contain theme-logo-dark"
                priority
              />
            </div>
          </div>

          {/* Center - App Label */}
          <div className="hidden md:flex items-center gap-2 bg-base-200 px-4 py-2 rounded-sm border border-base-300">
            <span className="text-xs font-display uppercase tracking-wider font-bold text-base-content">
              Counter Dapp
            </span>
          </div>

          {/* Right side - Network & Wallet */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Wallet Connection */}
            {isConnected && address ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary rounded-sm">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="text-base-content text-sm font-mono hidden sm:inline">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="p-2 bg-base-200 border border-base-300 hover:border-red-500 hover:bg-red-500/10 rounded-sm transition-colors group"
                  aria-label="Disconnect wallet"
                >
                  <LogOut className="w-4 h-4 text-base-content/50 group-hover:text-red-500" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openConnectModal?.()}
                className="flex items-center gap-2 px-4 py-2 btn-fhenix font-bold rounded-sm font-display uppercase text-sm"
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">Connect</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
