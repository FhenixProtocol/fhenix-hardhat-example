import { DeployFunction } from "hardhat-deploy/types";

// This task checks your contracts to ensure that they aren't exposing any encrypted data
// For example, if your contract has the following
//
// mapping(address => euint64) public encryptedBalances
//
// A malicious contract could call `VulnerableContract.encryptedBalances(user)`
// And then decrypt the euint64 that was returned.

const checkExposedEncryptedVars: DeployFunction = async function (hre) {
  await hre.run("task:fhenix:checkExposedEncryptedVars");
};

export default checkExposedEncryptedVars;
checkExposedEncryptedVars.tags = ["checkExposedEncryptedVars"];
checkExposedEncryptedVars.runAtTheEnd = true;
