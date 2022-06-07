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
        url: "https://eth-mainnet.alchemyapi.io/v2/oXLp-8YIAT9EluXzHFl_3Zq6Iqq625NT",
      },
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/32a7640da08d4454aeb52eeecd624162",
      accounts: [`${process.env.RINKEBY_PRIVATE_KEY}`],
    },
  },
  etherscan: { apiKey: process.env.ETHERSCAN_KEY },
};
