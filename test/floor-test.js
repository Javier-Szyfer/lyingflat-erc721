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
  let b4;
  let b5;
  let b6;
  let b7;
  let b8;
  let b9;
  let b10;
  let b11;
  let b12;
  let b13;
  let b14;
  let b15;
  let b16;

  beforeEach(async () => {
    [
      deployer,
      seller,
      buyer,
      buyer2,
      buyer3,
      buyer4,
      b5,
      b6,
      b4,
      b7,
      b8,
      b9,
      b10,
      b11,
      b12,
      b13,
      b14,
      b15,
      b16,
    ] = await ethers.getSigners();
    const LF = await ethers.getContractFactory("LayingFlat");
    layingFlat = await LF.deploy(
      "ipfs://bafybeiddblti7v4kmhda2neoggpr3jaikdz5rbp4xzzqqyjykotkmf45xy/"
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
        "ipfs://bafybeiddblti7v4kmhda2neoggpr3jaikdz5rbp4xzzqqyjykotkmf45xy/"
      );
    });
    it("Returns custom URI w tokenID", async () => {
      await layingFlat.connect(buyer4).mint(1, {
        value: ethers.utils.parseEther("0.1"),
      });
      const tURI = await layingFlat.tokenURI(1);
      expect(tURI).to.be.equal(
        "ipfs://bafybeiddblti7v4kmhda2neoggpr3jaikdz5rbp4xzzqqyjykotkmf45xy/1.token.json"
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
    it("mint only 20 total", async () => {
      await expect(
        layingFlat
          .connect(buyer4)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(buyer4.address, 1);

      await expect(
        layingFlat
          .connect(b4)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b4.address, 2);
      await expect(
        layingFlat
          .connect(b5)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b5.address, 3);
      await expect(
        layingFlat
          .connect(b6)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b6.address, 4);
      await expect(
        layingFlat
          .connect(b6)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b6.address, 5);
      await expect(
        layingFlat
          .connect(b7)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b7.address, 6);
      await expect(
        layingFlat
          .connect(b7)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b7.address, 7);
      await expect(
        layingFlat
          .connect(b8)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b8.address, 8);
      await expect(
        layingFlat
          .connect(b8)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b8.address, 9);
      await expect(
        layingFlat
          .connect(b9)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b9.address, 10);
      await expect(
        layingFlat
          .connect(b9)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b9.address, 11);
      await expect(
        layingFlat
          .connect(b10)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b10.address, 12);
      await expect(
        layingFlat
          .connect(b10)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b10.address, 13);
      await expect(
        layingFlat
          .connect(b11)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b11.address, 14);
      await expect(
        layingFlat
          .connect(b11)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b11.address, 15);
      await expect(
        layingFlat
          .connect(b12)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b12.address, 16);
      await expect(
        layingFlat
          .connect(b12)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b12.address, 17);
      await expect(
        layingFlat
          .connect(b13)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b13.address, 18);
      await expect(
        layingFlat
          .connect(b13)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b13.address, 19);
      await expect(
        layingFlat
          .connect(b14)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(layingFlat, "MintedAnNFT")
        .withArgs(b14.address, 20);
      await expect(
        layingFlat
          .connect(b14)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      ).to.be.revertedWith("Exceeds max supply");
    });
  });
});
