import type { Counter } from "../../types";
import axios from "axios";
import hre from "hardhat";

export async function deployCounterFixture(): Promise<{
  counter: Counter;
  address: string;
}> {
  const accounts = await hre.ethers.getSigners();
  const contractOwner = accounts[0];

  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.connect(contractOwner).deploy();
  await counter.waitForDeployment();
  const address = await counter.getAddress();
  return { counter, address };
}

export async function getTokensFromFaucet() {
  if (hre.network.name === "localfhenix") {
    const signers = await hre.ethers.getSigners();

    if (
      (await hre.ethers.provider.getBalance(signers[0].address)).toString() ===
      "0"
    ) {
      console.log("Balance for signer is 0 - getting tokens from faucet");
      const response = await axios.get(
        `http://localhost:42000/faucet?address=${signers[0].address}`,
      );
      const data = await response.data;
      console.log(`Success!: ${JSON.stringify(data)}`);
      // await waitForBlock(hre);
    }
  }
}
