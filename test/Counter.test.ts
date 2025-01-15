/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from "chai";
import hre, { ethers, fhenixsdk } from "hardhat";
import { Counter } from "../typechain-types";
import { getTokensFromFaucet } from "../utils/instance";
import { Encryptable } from "fhenixjs";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { TypedDataField } from "ethers";

export interface AbstractProvider {
  getChainId(): Promise<string>;
  call(tx: { to: string; data: string }): Promise<string>;
}

export interface AbstractSigner {
  getAddress(): Promise<string>;
  signTypedData(
    domain: object,
    types: Record<string, Array<object>>,
    value: object,
  ): Promise<string>;
}

describe("Counter", function () {
  let signer: SignerWithAddress;

  let counter: Counter;

  before(async () => {
    signer = (await ethers.getSigners())[0];
    await getTokensFromFaucet(hre, signer.address);

    const counterFactory = await ethers.getContractFactory("Counter");
    counter = await counterFactory.deploy();
    await counter.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have the correct initial count on deploy", async function () {
      expect(await counter.getUserCounter(signer.address)).to.equal(0n);
    });

    it("should add amount to the counter successfully", async function () {
      const toCount = 10;

      // Before creating a permission or encrypting values, `fhenixsdk` must be initialized
      // NOTE: This uses the hardhat `fhenixsdk.initializeWithHHSigner` to initialize the sdk with an ethers `SignerWithAddress`
      await fhenixsdk.initializeWithHHSigner({ signer, projects: ["COUNTER"] });

      // Before sending the amount to count to the Counter contract
      // It must first be encrypted outside the contract (within this test / frontend)
      const toEncrypt = Encryptable.uint32(toCount);
      const encryptedResult = fhenixsdk.encrypt(toEncrypt);

      expect(encryptedResult.success).to.equal(true);
      if (encryptedResult.success === false) return;
      const encrypted = encryptedResult.data;

      // Add to the counter
      await counter.connect(signer).add(encrypted);

      const args = fhenixsdk.encrypt("permission" as const);

      const sealedCountedAmount = await counter
        .connect(signer)
        .getUserCounterPermitSealed(args.data!);

      const unsealedCountedAmount = await fhenixsdk.unseal(sealedCountedAmount);

      expect(unsealedCountedAmount.success).to.equal(true);
      expect(unsealedCountedAmount.data).to.equal(
        toCount,
        "The unsealed counted amount should increase by toCount",
      );

      // The Counter contract has a view function that decrypts the counter as a sanity check
      // This function leaks data, and should not be used in prod
      const decryptedCountedAmount = await counter.getUserCounter(
        signer.address,
      );
      expect(decryptedCountedAmount).to.equal(
        toCount,
        "The decrypted counted amount should increase by toCount",
      );
    });
  });
});
