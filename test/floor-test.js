const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("LayingFlat", function () {
  let deployer;
  let seller;
  let buyer;
  let buyer2;
  let buyer3;
  let buyer4;
  let provider;

  beforeEach(async () => {
    [deployer, seller, buyer, buyer2, buyer3, buyer4] =
      await ethers.getSigners();
    const LF = await ethers.getContractFactory("LayingFlat");
    layingFlat = await LF.deploy(
      "ipfs://bafybeiacjsrxsjqraaa4aheoz2ppj7ndggogzekkdhmi2amt2ybeks6624/"
    );
    await layingFlat.deployed();
    provider = waffle.provider;
    await layingFlat.setIsPublicSaleActive(true);
    const contractBalance = await provider.getBalance(deployer.address);
  });
  describe("Deployment", () => {
    it("Should set the right owner", async function () {
      expect(await layingFlat.owner()).to.equal(deployer.address);
    });
    it("MAX_SUPPLY is 20", async () => {
      const totalSupply = await layingFlat.MAX_SUPPLY();
      expect(totalSupply).to.be.equal(20);
    });
    it("It has the correct Owner", async () => {
      const owner = await layingFlat.owner();
      expect(owner).to.equal(deployer.address);
    });
    it("MINTING COST IS 0.1 ETHER", async () => {
      const cost = await layingFlat.PRICE();
      expect(cost).to.be.equal(ethers.utils.parseEther("0.1"));
    });
    it("MAX MINT PER WALLET IS 2", async () => {
      const mintLimit = await layingFlat.MINT_LIMIT_PER_WALLET();
      expect(mintLimit).to.be.equal(2);
    });
  });
  describe("Minting", () => {
    it("Mints 2 NFT", async () => {
      await layingFlat.connect(buyer).mint(2, {
        value: ethers.utils.parseEther("0.2"),
      });
      const balance = await layingFlat.balanceOf(buyer.address);
      expect(balance).to.be.equal(2);
    });
    it("Reverts if already minted 2 and then wants one more", async () => {
      await layingFlat.connect(buyer2).mint(2, {
        value: ethers.utils.parseEther("0.2"),
      });
      await expect(
        layingFlat.connect(buyer2).mint(1, {
          value: ethers.utils.parseEther("0.1"),
        })
      ).to.be.revertedWith("Minting limit exceeded");
    });
    it("Reverts if minting amount exceed MAX_AMOUNT", async () => {
      await expect(
        layingFlat.connect(buyer4).mint(3, {
          value: ethers.utils.parseEther("0.3"),
        })
      ).to.be.revertedWith("Minting limit exceeded");
    });
    it("Reverts if insufficient payment", async () => {
      await expect(
        layingFlat.connect(buyer3).mint(1, {
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("Insufficient payment");
    });
    it("Returns custom URI", async () => {
      const uri = await layingFlat.contractURI();
      expect(uri).to.be.equal(
        "ipfs://bafybeiacjsrxsjqraaa4aheoz2ppj7ndggogzekkdhmi2amt2ybeks6624/"
      );
    });
    it("Returns custom URI w tokenID", async () => {
      await layingFlat.connect(buyer4).mint(1, {
        value: ethers.utils.parseEther("0.1"),
      });
      const tURI = await layingFlat.tokenURI(1);
      expect(tURI).to.be.equal(
        "ipfs://bafybeiacjsrxsjqraaa4aheoz2ppj7ndggogzekkdhmi2amt2ybeks6624/1.token.json"
      );
    });
    it("Emits MintedAnNFT event", async () => {
      await expect(
        layingFlat
          .connect(buyer4)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(buyer4.address, 1);
    });
  });
  describe("Minting", () => {
    it("Only owner can call Withdraw ", async () => {
      await expect(layingFlat.connect(buyer4).withdraw()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    // TEST NOT WORKING PROPERLY
    it("Withdraw FN splits funds in half", async () => {
      const padd1 = await layingFlat.payoutAddress1();
      const padd2 = await layingFlat.payoutAddress2();
      const payoutAddress1 = await layingFlat.balanceOf(padd1);
      console.log(payoutAddress1);
      const payoutAddress2 = await layingFlat.balanceOf(padd2);
      console.log(payoutAddress2);

      await layingFlat.connect(deployer).withdraw();
      const payoutAddress1New = await layingFlat.balanceOf(padd1);
      console.log(payoutAddress1New);
      const payoutAddress2New = await layingFlat.balanceOf(padd2);
      console.log(payoutAddress2New);
      expect(payoutAddress1New).to.be.equal(payoutAddress2New);
    });
  });
});
