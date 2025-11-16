const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let Token, token, owner, addr1, addr2;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    Token = await ethers.getContractFactory("MyToken");
    token = await Token.deploy("MyToken", "MTK", 1000); // 1000 tokens
    await token.waitForDeployment();
  });

  it("Should set correct name, symbol, decimals", async () => {
    expect(await token.name()).to.equal("MyToken");
    expect(await token.symbol()).to.equal("MTK");
    expect(await token.decimals()).to.equal(18);
  });

  it("Should assign initial supply to owner", async () => {
    const ownerBalance = await token.balanceOf(await owner.getAddress());
    expect(ownerBalance).to.equal(ethers.parseEther("1000"));
  });

  it("Should transfer tokens", async () => {
    await token.transfer(await addr1.getAddress(), ethers.parseEther("10"));
    const bal = await token.balanceOf(await addr1.getAddress());
    expect(bal).to.equal(ethers.parseEther("10"));
  });

  it("Should approve and allow transferFrom", async () => {
    await token.approve(await addr1.getAddress(), ethers.parseEther("20"));
    await token
      .connect(addr1)
      .transferFrom(
        await owner.getAddress(),
        await addr2.getAddress(),
        ethers.parseEther("20")
      );

    const bal = await token.balanceOf(await addr2.getAddress());
    expect(bal).to.equal(ethers.parseEther("20"));
  });

  it("Should revert transfer when balance is low", async () => {
    await expect(
      token.connect(addr1).transfer(await owner.getAddress(), 5)
    ).to.be.revertedWith("Insufficient balance");
  });

  it("Should mint tokens (owner only)", async () => {
    await token.mint(await addr1.getAddress(), 50);
    const bal = await token.balanceOf(await addr1.getAddress());
    expect(bal).to.equal(ethers.parseEther("50"));
  });

  it("Should NOT mint tokens when not owner", async () => {
    await expect(
      token.connect(addr1).mint(await addr1.getAddress(), 10)
    ).to.be.revertedWith("Not owner");
  });

  it("Should burn tokens", async () => {
    await token.burn(ethers.parseEther("5"));
    const bal = await token.balanceOf(await owner.getAddress());
    expect(bal).to.equal(ethers.parseEther("995"));
  });
});
