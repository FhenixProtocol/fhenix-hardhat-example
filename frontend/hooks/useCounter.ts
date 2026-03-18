"use client";

import { useCallback, useState } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import { sepolia } from "wagmi/chains";
import toast from "react-hot-toast";
import { useCofhe } from "@/hooks/useCofhe";
import {
  COUNTER_ABI,
  COUNTER_CONTRACT_ADDRESS,
} from "@/utils/counterContracts";

const ZERO = BigInt(0);

export function useCounter() {
  const publicClient = usePublicClient({ chainId: sepolia.id });
  const { data: walletClient } = useWalletClient({ chainId: sepolia.id });
  const { isInitialized, encrypt, unseal, Encryptable } = useCofhe();

  const [counterValue, setCounterValue] = useState<bigint>(ZERO);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshCounter = useCallback(async () => {
    if (!publicClient) {
      toast.error("Public client not available.");
      return;
    }

    if (!isInitialized) {
      toast.error("FHE not initialized yet. Connect wallet first.");
      return;
    }

    setIsRefreshing(true);

    try {
      const code = await publicClient.getCode({
        address: COUNTER_CONTRACT_ADDRESS,
      });
      if (!code || code === "0x") {
        toast.error(
          "Counter contract not found on Ethereum Sepolia. Check the address/network."
        );
        return;
      }

      const sealedValue = await publicClient.readContract({
        address: COUNTER_CONTRACT_ADDRESS,
        abi: COUNTER_ABI,
        functionName: "getCounter",
      });

      let resolvedValue: bigint;

      if (typeof sealedValue === "string") {
        const unsealed = await unseal(sealedValue);
        resolvedValue = BigInt(unsealed as string | number | bigint);
      } else {
        resolvedValue = BigInt(sealedValue as bigint | number | string);
      }

      setCounterValue(resolvedValue);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch counter value.";
      toast.error(message);
    } finally {
      setIsRefreshing(false);
    }
  }, [publicClient, isInitialized, unseal]);

  const addEncrypted = useCallback(
    async (amount: number) => {
      if (!walletClient || !publicClient) {
        toast.error("Wallet client not available.");
        return;
      }

      if (!isInitialized) {
        toast.error("FHE not initialized yet. Try again.");
        return;
      }

      if (!Number.isFinite(amount) || amount < 0) {
        toast.error("Enter a valid non-negative number.");
        return;
      }

      setIsSubmitting(true);

      try {
        const encrypted = await encrypt(Encryptable.uint32(amount));
        const encryptedValue = {
          data: encrypted.data,
          securityZone: encrypted.securityZone ?? 0,
        };

        const hash = await walletClient.writeContract({
          address: COUNTER_CONTRACT_ADDRESS,
          abi: COUNTER_ABI,
          functionName: "add",
          args: [encryptedValue],
        });

        await publicClient.waitForTransactionReceipt({ hash });
        await refreshCounter();
        toast.success("Counter updated.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Transaction failed.";
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [walletClient, publicClient, isInitialized, encrypt, Encryptable, refreshCounter]
  );

  return {
    counterValue,
    isRefreshing,
    isSubmitting,
    refreshCounter,
    addEncrypted,
    isCofheInitialized: isInitialized,
  };
}
