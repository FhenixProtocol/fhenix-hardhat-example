"use client";

import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";
import {
  Encryptable,
  Environment,
  FheTypes,
  Permit,
  PermitOptions,
  cofhejs,
  permitStore,
} from "cofhejs/web";
import { Address } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useCofheStore } from "@/services/store/cofheStore";

interface CofheConfig {
  environment: Environment;
  coFheUrl?: string;
  verifierUrl?: string;
  thresholdNetworkUrl?: string;
  ignoreErrors?: boolean;
  generatePermit?: boolean;
}

export function useCofhe(config?: Partial<CofheConfig>) {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();
  const {
    isInitialized: globalIsInitialized,
    setIsInitialized: setGlobalIsInitialized,
  } = useCofheStore();

  const chainId = publicClient?.chain?.id;
  const accountAddress = walletClient?.account?.address;

  const [isInitializing, setIsInitializing] = useState(false);
  const [isGeneratingPermit, setIsGeneratingPermit] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [permit, setPermit] = useState<Permit | undefined>(undefined);

  // Add checks to ensure we're in a browser environment
  const isBrowser = typeof window !== "undefined";

  // Reset initialization when chain changes
  useEffect(() => {
    setGlobalIsInitialized(false);
  }, [chainId, accountAddress, setGlobalIsInitialized]);

  // Initialize when wallet is connected
  useEffect(() => {
    // Skip initialization if not in browser or wallet not connected
    if (!isBrowser || !isConnected) return;

    const initialize = async () => {
      if (
        globalIsInitialized ||
        isInitializing ||
        !publicClient ||
        !walletClient
      )
        return;
      try {
        setIsInitializing(true);

        const defaultConfig = {
          verifierUrl: undefined,
          coFheUrl: undefined,
          thresholdNetworkUrl: undefined,
          ignoreErrors: false,
          generatePermit: false,
        };

        // Merge default config with user-provided config
        const mergedConfig = { ...defaultConfig, ...config };
        const result = await cofhejs.initializeWithViem({
          viemClient: publicClient,
          viemWalletClient: walletClient,
          environment: "TESTNET",
          verifierUrl: mergedConfig.verifierUrl,
          coFheUrl: mergedConfig.coFheUrl,
          thresholdNetworkUrl: mergedConfig.thresholdNetworkUrl,
          ignoreErrors: mergedConfig.ignoreErrors,
          generatePermit: mergedConfig.generatePermit,
        });

        if (result.success) {
          console.log("Cofhe initialized successfully");
          setGlobalIsInitialized(true);
          setPermit(result.data);
          setError(null);
        } else {
          setError(new Error(result.error.message || String(result.error)));
        }
      } catch (err) {
        console.error("Failed to initialize Cofhe:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Unknown error initializing Cofhe")
        );
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isConnected,
    walletClient,
    publicClient,
    config,
    chainId,
    isInitializing,
    accountAddress,
    globalIsInitialized,
    setGlobalIsInitialized,
  ]);

  const createPermit = useCallback(
    async (permitOptions?: PermitOptions) => {
      if (!globalIsInitialized || !accountAddress) {
        return {
          success: false,
          error: "CoFHE not initialized or wallet not connected",
        };
      }

      try {
        setIsGeneratingPermit(true);
        setError(null);

        const result = await cofhejs.createPermit(permitOptions);

        if (result.success) {
          console.log("Permit generated successfully");
          setPermit(result.data);
          setError(null);
          return result;
        } else {
          setError(new Error(result.error.message || String(result.error)));
          return result;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Unknown error generating permit";
        const errorResult = {
          success: false as const,
          error: { message: errorMessage },
        };
        setError(new Error(errorMessage));
        return errorResult;
      } finally {
        setIsGeneratingPermit(false);
      }
    },
    [globalIsInitialized, accountAddress]
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { createPermit: _, ...cofhejsWithoutCreatePermit } = cofhejs;

  return {
    isInitialized: globalIsInitialized,
    isInitializing,
    isGeneratingPermit,
    error,
    permit,
    createPermit,
    ...cofhejsWithoutCreatePermit,
    FheTypes,
    Encryptable,
  };
}

// Helper to get initial state without triggering cascading renders
const getInitializedState = () => {
  const state = cofhejs.store.getState();
  return (
    state.providerInitialized &&
    state.signerInitialized &&
    state.fheKeysInitialized
  );
};

const getAccountState = () => cofhejs.store.getState().account;

const getActivePermitHashState = () =>
  permitStore.store.getState().activePermitHash as unknown as Record<
    Address,
    string | undefined
  >;

export const useCofhejsInitialized = () => {
  const initialized = useSyncExternalStore(
    cofhejs.store.subscribe,
    getInitializedState,
    () => false // Server snapshot
  );
  return initialized;
};

export const useCofhejsAccount = () => {
  const account = useSyncExternalStore(
    cofhejs.store.subscribe,
    getAccountState,
    () => null // Server snapshot
  );
  return account;
};

export const useCofhejsActivePermitHashes = () => {
  // useSyncExternalStore already provides stable references, no need for useMemo wrapper
  return useSyncExternalStore(
    permitStore.store.subscribe,
    getActivePermitHashState,
    () => ({}) as Record<Address, string | undefined> // Server snapshot
  );
};

export const useCofhejsActivePermitHash = () => {
  const account = useCofhejsAccount();
  const activePermitHashes = useCofhejsActivePermitHashes();

  return useMemo(() => {
    if (!account) return undefined;
    return activePermitHashes[account as Address];
  }, [account, activePermitHashes]);
};

export const useCofhejsActivePermit = () => {
  const { chainId } = useAccount();
  const account = useCofhejsAccount();
  const initialized = useCofhejsInitialized();
  const activePermitHash = useCofhejsActivePermitHash();

  return useMemo(() => {
    if (!account || !initialized) return undefined;
    return permitStore.getPermit(
      chainId?.toString(),
      account,
      activePermitHash
    );
  }, [account, initialized, activePermitHash, chainId]);
};

export const useCofhejsAllPermits = () => {
  const account = useCofhejsAccount();
  const initialized = useCofhejsInitialized();

  const getAllPermitsSnapshot = useCallback(() => {
    if (!account || !initialized) return undefined;
    const permitsFromStore = cofhejs.getAllPermits();
    return Object.values(permitsFromStore?.data ?? {});
  }, [account, initialized]);

  const allPermits = useSyncExternalStore(
    permitStore.store.subscribe,
    getAllPermitsSnapshot,
    () => undefined // Server snapshot
  );

  return allPermits;
};

// Export FheTypes directly for convenience
export { FheTypes } from "cofhejs/web";
