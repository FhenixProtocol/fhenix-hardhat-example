import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type Permission } from "fhenixjs";
import { type HardhatRuntimeEnvironment } from "hardhat/types/runtime";

export const getTokensFromFaucet = async (
  hre: HardhatRuntimeEnvironment,
  address: string,
) => {
  if (hre.network.name === "localfhenix") {
    if ((await hre.ethers.provider.getBalance(address)).toString() === "0") {
      await hre.fhenixjs.getFunds(address);
    }
  }
};

export const createPermissionForContract = async (
  hre: HardhatRuntimeEnvironment,
  signer: SignerWithAddress,
  contractAddress: string,
): Promise<Permission> => {
  const provider = hre.ethers.provider;

  const permit = await hre.fhenixjs.generatePermit(
    contractAddress,
    provider,
    signer,
  );
  const permission = hre.fhenixjs.extractPermitPermission(permit);

  return permission;
};
