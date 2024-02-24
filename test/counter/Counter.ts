import { createFheInstance } from "../../utils/instance";
import type { Signers } from "../types";
import { shouldBehaveLikeCounter } from "./Counter.behavior";
import { deployCounterFixture, getTokensFromFaucet } from "./Counter.fixture";
import hre from "hardhat";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    // get tokens from faucet if we're on localfhenix and don't have a balance
    await getTokensFromFaucet();
    // deploy test contract
    const { counter, address } = await deployCounterFixture();
    this.counter = counter;

    // initiate fhenixjs
    this.instance = await createFheInstance(hre, address);

    // set admin account/signer
    const signers = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("Counter", function () {
    shouldBehaveLikeCounter();
  });
});
