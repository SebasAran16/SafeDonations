require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const PRIVATE_KEY2 = process.env.PRIVATE_KEY_AC2;
const PRIVATE_KEY1 = process.env.PRIVATE_KEY_AC1;
const PRIVATE_KEY3 = process.env.PRIVATE_KEY_AC3;
const PRIVATE_KEY4 = process.env.PRIVATE_KEY_AC4;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const ARBITRUM_RPC_URL = process.env.ARBITRUM_RPC_URL;
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const CHIADO_RPC_URL = process.env.CHIADO_RPC_URL;
const GNOSIS_RPC_URL = process.env.GNOSIS_RPC_URL;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.13" },
      { version: "0.4.19" },
      { version: "0.6.12" },
      { version: "0.6.0" },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    arbitrum: {
      url: "https://arb-mainnet.g.alchemy.com/v2/YKfPwrPkRmIJI--7SxBAcJOsWx01jNpc",
      accounts: [PRIVATE_KEY2],
      chainId: 42161,
      blockConfirmations: 6,
    },
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545/",
      //accounts: Thx hardhat haha!
      blockConfirmations: 1,
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY1, PRIVATE_KEY2, PRIVATE_KEY3, PRIVATE_KEY4],
      chainId: 5,
      blockConfirmations: 6,
      saveDeployments: true,
    },
    chiado: {
      url: CHIADO_RPC_URL,
      accounts: [PRIVATE_KEY1, PRIVATE_KEY2, PRIVATE_KEY3, PRIVATE_KEY4],
      chainId: 10200.,
      blockConfirmations: 5,
      saveDeployments: true,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY1, PRIVATE_KEY2, PRIVATE_KEY3, PRIVATE_KEY4],
      chainId: 11155111.,
      blockConfirmations: 5,
      saveDeployments: true,
    }
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
      sepolia: ETHERSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "ETH",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    admin: {
      default: 1,
    },
    donee: {
      default: 2,
    },
    donee2: {
      default: 3,
    },
  },
  mocha: {
    timeout: 300000, //Thats miliseconds = 200 secondsd max
  },
};
