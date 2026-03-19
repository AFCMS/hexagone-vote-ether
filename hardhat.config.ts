import { defineConfig } from "hardhat/config";
import hardhatVerify from "@nomicfoundation/hardhat-verify";

import "dotenv/config";

export default defineConfig({
  plugins: [hardhatVerify],
  solidity: {
    version: "0.8.28",
  },
  networks: {
    ganache: {
      type: "http",
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
    sepolia: {
      type: "http",
      url: process.env.ALCHEMY_URL,
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  verify: {
    etherscan: {
      enabled: true,
      apiKey: process.env.ETHERSCAN_API_KEY,
    },
    blockscout: {
      enabled: true,
    },
  },
});
