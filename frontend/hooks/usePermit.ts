"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import { useAccount } from "wagmi";
import { cofhejs, permitStore } from "cofhejs/web";
import { useCofheStore } from "@/services/store/cofheStore";

// Snapshot function to get permit status
const getPermitSnapshot = () => {
  const permitResult = cofhejs?.getPermit();
  return !!(permitResult?.success && permitResult?.data);
};

// Server snapshot (always false)
const getServerSnapshot = () => false;

export function usePermit() {
  const { address, chainId } = useAccount();
  const { isInitialized: isCofheInitialized } = useCofheStore();

  const [isGeneratingPermit, setIsGeneratingPermit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use useSyncExternalStore to subscribe to permit changes
  const hasValidPermit = useSyncExternalStore(
    permitStore.store.subscribe,
    () => (isCofheInitialized ? getPermitSnapshot() : false),
    getServerSnapshot
  );

  // Check for valid permit (manual check)
  const checkPermit = useCallback(() => {
    if (!isCofheInitialized) {
      return false;
    }
    return getPermitSnapshot();
  }, [isCofheInitialized]);

  // Generate new permit
  const generatePermit = useCallback(async () => {
    if (!isCofheInitialized || !address || isGeneratingPermit) {
      return { success: false, error: "Not ready to generate permit" };
    }

    try {
      setIsGeneratingPermit(true);
      setError(null);

      const permitName = "Sealed Bid Auction";
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      const result = await cofhejs.createPermit({
        type: "self",
        name: permitName,
        issuer: address,
        expiration: Math.round(expirationDate.getTime() / 1000),
      });

      if (result?.success) {
        console.log("Permit created successfully");
        setError(null);
        return { success: true };
      } else {
        const errorMessage =
          result?.error?.message || "Failed to create permit";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error generating permit";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsGeneratingPermit(false);
    }
  }, [isCofheInitialized, address, isGeneratingPermit]);

  // Remove permit function
  const removePermit = useCallback(async () => {
    if (!isCofheInitialized || !chainId || !address) {
      console.log("Cannot remove permit: missing required data");
      return false;
    }

    try {
      // Get current active permit hash
      const activePermitResult = cofhejs?.getPermit();
      if (!activePermitResult?.success || !activePermitResult?.data) {
        console.log("No active permit to remove");
        return false;
      }

      // Remove the permit from the store
      const allPermits = permitStore.getPermits(chainId.toString(), address);
      if (allPermits && Object.keys(allPermits).length > 0) {
        const permitHash = Object.keys(allPermits)[0];
        permitStore.removePermit(chainId.toString(), address, permitHash, true);
      } else {
        console.log("No permits found to remove");
        return false;
      }

      setError(null);
      console.log("Permit removed successfully");
      return true;
    } catch (err) {
      console.error("Error removing permit:", err);
      setError("Failed to remove permit");
      return false;
    }
  }, [isCofheInitialized, chainId, address]);

  return {
    hasValidPermit,
    isGeneratingPermit,
    error,
    generatePermit,
    checkPermit,
    removePermit,
  };
}
