"use client";

import {
  X,
  Key,
  Shield,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useCofhe } from "@/hooks/useCofhe";
import { usePermit } from "@/hooks/usePermit";
import { useAccount, useChainId, useChains } from "wagmi";

interface PermitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PermitModal = ({ isOpen, onClose }: PermitModalProps) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const chains = useChains();
  const { isInitialized, isInitializing, error: cofheError } = useCofhe();
  const {
    hasValidPermit,
    isGeneratingPermit,
    error: permitError,
    generatePermit,
    removePermit,
  } = usePermit();

  const chainName =
    chains.find((c) => c.id === chainId)?.name || `Chain ${chainId}`;

  if (!isOpen) return null;

  const handleGeneratePermit = async () => {
    await generatePermit();
  };

  const handleRevokePermit = async () => {
    await removePermit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-base-100 border border-base-300 rounded-sm shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-sm">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-base-content font-display uppercase tracking-wide">
              Manage Permit
            </h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-square" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Section */}
          <div className="p-4 bg-base-200 border border-base-300 rounded-sm">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm text-base-content">
                  A permit is required to view your encrypted (shielded)
                  balances. Click &quot;Generate&quot; and sign the message in
                  your wallet to create one.
                </p>
                <p className="text-xs text-base-content/60">
                  Permits are stored locally and are chain-specific.
                </p>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-base-200 border border-base-300 rounded-sm">
              <span className="text-sm font-pixel text-base-content/60 uppercase">
                Network
              </span>
              <span className="text-sm font-mono text-base-content">
                {chainName}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-base-200 border border-base-300 rounded-sm">
              <span className="text-sm font-pixel text-base-content/60 uppercase">
                COFHE Status
              </span>
              <div className="flex items-center gap-2">
                {isInitializing ? (
                  <>
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-sm text-primary">
                      Initializing...
                    </span>
                  </>
                ) : isInitialized ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500">Ready</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-yellow-500">Not Ready</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-base-200 border border-base-300 rounded-sm">
              <span className="text-sm font-pixel text-base-content/60 uppercase">
                Permit Status
              </span>
              <div className="flex items-center gap-2">
                {hasValidPermit ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500">Active</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-yellow-500">
                      Not Generated
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {(cofheError || permitError) && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">
                  {cofheError?.message || permitError}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-base-300 space-y-3">
          {!hasValidPermit ? (
            <button
              onClick={handleGeneratePermit}
              disabled={!isInitialized || isGeneratingPermit || !address}
              className="btn btn-fhenix w-full font-bold tracking-wider rounded-sm h-12 font-display uppercase"
            >
              {isGeneratingPermit ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5 mr-2" />
                  Generate Permit
                </>
              )}
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleRevokePermit}
                className="btn btn-outline btn-error flex-1 font-bold tracking-wider rounded-sm h-12 font-display uppercase"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Revoke
              </button>
              <button
                onClick={handleGeneratePermit}
                disabled={isGeneratingPermit}
                className="btn btn-fhenix flex-1 font-bold tracking-wider rounded-sm h-12 font-display uppercase"
              >
                {isGeneratingPermit ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Regenerate
                  </>
                )}
              </button>
            </div>
          )}

          {!address && (
            <p className="text-center text-sm font-pixel text-base-content/40 uppercase tracking-widest">
              {"// Connect wallet to generate permit"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
