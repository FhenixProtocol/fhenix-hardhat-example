"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { sepolia } from "wagmi/chains";
import { useCounter } from "@/hooks/useCounter";
import { COUNTER_CONTRACT_ADDRESS } from "@/utils/counterContracts";

const shortAddress = (value?: string) => {
  if (!value) return "-";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

export function CounterPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const {
    counterValue,
    isRefreshing,
    isSubmitting,
    refreshCounter,
    addEncrypted,
    isCofheInitialized,
  } = useCounter();

  const [inputValue, setInputValue] = useState("");

  const isCorrectNetwork = chainId === sepolia.id;

  const explorerBase =
    sepolia.blockExplorers?.default.url ?? "https://sepolia.etherscan.io";

  const parsedAmount = useMemo(() => {
    const amount = Number(inputValue);
    return Number.isFinite(amount) ? amount : NaN;
  }, [inputValue]);

  useEffect(() => {
    if (!isConnected || !isCorrectNetwork || !isCofheInitialized) return;
    refreshCounter();
    const timer = setInterval(() => refreshCounter(), 12000);
    return () => clearInterval(timer);
  }, [isConnected, isCorrectNetwork, isCofheInitialized, refreshCounter]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-base-200 border border-base-300 p-5">
          <p className="text-xs font-display uppercase tracking-widest text-base-content/60">
            Connected Wallet
          </p>
          <p className="mt-2 text-lg font-mono text-base-content">
            {isConnected ? shortAddress(address) : "Not connected"}
          </p>
        </div>

        <div className="bg-base-200 border border-base-300 p-5">
          <p className="text-xs font-display uppercase tracking-widest text-base-content/60">
            Counter Value
          </p>
          <p className="mt-2 text-2xl font-mono text-base-content">
            {counterValue.toString()}
          </p>
        </div>

        <div className="bg-base-200 border border-base-300 p-5">
          <p className="text-xs font-display uppercase tracking-widest text-base-content/60">
            Contract
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-mono text-base-content">
              {shortAddress(COUNTER_CONTRACT_ADDRESS)}
            </span>
            <a
              href={`${explorerBase}/address/${COUNTER_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-xs font-semibold uppercase"
            >
              Explorer <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-base-200 border border-base-300 p-6 grid gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-base-content/70">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-xs font-display uppercase tracking-widest">
              Encrypted Counter Update
            </span>
          </div>
          <p className="text-sm text-base-content/60">
            Add an encrypted uint32 value to the counter on Ethereum Sepolia.
          </p>
        </div>

        <input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Enter number (e.g. 42)"
          className="w-full bg-base-100 border border-base-300 px-3 py-2 text-sm font-mono text-base-content focus:outline-none focus:border-primary"
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => refreshCounter()}
            disabled={!isConnected || !isCorrectNetwork || isRefreshing}
            className="btn btn-outline btn-sm font-display uppercase tracking-wider"
          >
            <RefreshCw className="w-4 h-4" />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>

          {!isCorrectNetwork && (
            <button
              onClick={() => switchChainAsync({ chainId: sepolia.id })}
              disabled={!isConnected}
              className="btn btn-warning btn-sm font-display uppercase tracking-wider"
            >
              Switch to Ethereum Sepolia
            </button>
          )}

          <button
            onClick={() => addEncrypted(parsedAmount)}
            disabled={
              !isConnected ||
              !isCorrectNetwork ||
              !isCofheInitialized ||
              isSubmitting ||
              !Number.isFinite(parsedAmount)
            }
            className="btn btn-fhenix btn-sm font-display uppercase tracking-wider"
          >
            {isSubmitting ? "Submitting..." : "Submit Encrypted Add"}
          </button>
        </div>

        {!isConnected && (
          <p className="text-xs text-base-content/50 font-display uppercase tracking-widest">
            Connect wallet to read and update the counter.
          </p>
        )}
        {isConnected && !isCorrectNetwork && (
          <p className="text-xs text-base-content/50 font-display uppercase tracking-widest">
            Switch to Ethereum Sepolia to continue.
          </p>
        )}
        {isConnected && isCorrectNetwork && !isCofheInitialized && (
          <p className="text-xs text-base-content/50 font-display uppercase tracking-widest">
            Initializing FHE... approve wallet prompts if needed.
          </p>
        )}
      </div>
    </div>
  );
}
