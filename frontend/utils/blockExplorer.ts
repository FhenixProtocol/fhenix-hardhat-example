const ETHERSCAN_SEPOLIA_URL = "https://sepolia.etherscan.io";

export function getBlockExplorerUrl(): string {
  return ETHERSCAN_SEPOLIA_URL;
}

export function getBlockExplorerTxUrl(txHash: string): string {
  return `${ETHERSCAN_SEPOLIA_URL}/tx/${txHash}`;
}

export function getBlockExplorerAddressUrl(address: string): string {
  return `${ETHERSCAN_SEPOLIA_URL}/address/${address}`;
}

export function formatTxHash(hash: string): string {
  if (!hash || hash.length < 16) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}
