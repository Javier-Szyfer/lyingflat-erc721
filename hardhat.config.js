require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.12",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_MAINNET_KEY}`,
      },
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_RINKEBY_API}`,
      accounts: [`${process.env.RINKEBY_PRIVATE_KEY}`],
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_MAINNET_KEY}`,
      accounts: [`${process.env.MAINNET_PRIVATE_KEY}`],
    },
  },
  etherscan: { apiKey: process.env.ETHERSCAN_KEY },
};
