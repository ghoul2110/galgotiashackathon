require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const AVAX_RPC_URL = process.env.AVAX_RPC_URL;
const BASE_RPC_URL = process.env.BASE_RPC_URL;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: { enabled: true, runs: 200 },
          viaIR: true
        }
      },
      {
        version: "0.8.28",
        settings: {
          optimizer: { enabled: true, runs: 200 },
          viaIR: true
        }
      }
    ]
  },
  networks: {
    fuji: {
      url: AVAX_RPC_URL,
      chainId: 43113,
      accounts: [PRIVATE_KEY]
    },
    base: {
      url: BASE_RPC_URL || "https://mainnet.base.org",
      chainId: 8453,
      accounts: [PRIVATE_KEY]
    },
    baseGoerli: {
      url: BASE_RPC_URL || "https://goerli.base.org",
      chainId: 84531,
      accounts: [PRIVATE_KEY]
    }
  }
};
