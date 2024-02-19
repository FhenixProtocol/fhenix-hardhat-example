import { expect } from "chai";
import hre from "hardhat";

export function shouldBehaveLikeCounter(): void {
  it("should add amount to the counter and verify the result", async function () {
    const amountToCount = 10;

    const eAmountCount = await this.instance.instance.encrypt_uint32(
      amountToCount,
    );
    await this.counter.connect(this.signers.admin).add(eAmountCount);

    // await waitForBlock(hre);

    const eAmount = await this.counter
      .connect(this.signers.admin)
      .getCounterPermitSealed(this.instance.permission);
    const amount = this.instance.instance.unseal(
      await this.counter.getAddress(),
      eAmount,
    );

    expect(Number(amount) === amountToCount);
  });
}
