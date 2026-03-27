import toast from "react-hot-toast";

const ETHERSCAN_SEPOLIA_URL = "https://sepolia.etherscan.io";

/**
 * Get the Ethereum Sepolia transaction URL
 */
export function getExplorerTxUrl(txHash: string): string {
  return `${ETHERSCAN_SEPOLIA_URL}/tx/${txHash}`;
}

/**
 * Get the Ethereum Sepolia address URL
 */
export function getExplorerAddressUrl(address: string): string {
  return `${ETHERSCAN_SEPOLIA_URL}/address/${address}`;
}

/**
 * Show a success toast with a link to view the transaction on Ethereum Sepolia explorer
 */
export function toastTxSuccess(message: string, txHash: string, toastId?: string) {
  const explorerUrl = getExplorerTxUrl(txHash);

  toast.success(
    (t) => (
      <div className="flex flex-col gap-1">
        <span>{message}</span>
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          View on Ethereum Sepolia →
        </a>
      </div>
    ),
    {
      id: toastId,
      duration: 5000,
    }
  );
}
