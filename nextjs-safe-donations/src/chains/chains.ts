import Chain from "../models/chain";

export const gnosisChain: Chain = {
  id: "0x64",
  token: "xDai",
  shortName: "gno",
  label: "Gnosis Chain",
  rpcUrl: "https://rpc.chiado.gnosis.gateway.fm",
  blockExplorerUrl: "https://gnosisscan.io",
  color: "#3e6957",
  transactionServiceUrl: "https://safe-transaction-gnosis-chain.safe.global",
  isStripePaymentsEnabled: false,
};

export const goerliChain: Chain = {
  id: "0x5",
  token: "gETH",
  label: "Görli",
  shortName: "gor",
  rpcUrl:
    "https://eth-goerli.g.alchemy.com/v2/A_UsoaLrFod21q4DavJDPwaO1_RtMmwk",
  blockExplorerUrl: "https://goerli.etherscan.io",
  color: "#fbc02d",
  transactionServiceUrl: "https://safe-transaction-goerli.safe.global",
  isStripePaymentsEnabled: false,
};

export const mainnetChain: Chain = {
  id: "0x1",
  token: "ETH",
  label: "Ethereum",
  shortName: "eth",
  rpcUrl: "https://cloudflare-eth.com",
  blockExplorerUrl: "https://etherscan.io",
  color: "#DDDDDD",
  transactionServiceUrl: "https://safe-transaction-mainnet.safe.global",
  isStripePaymentsEnabled: false,
};

export const polygonChain: Chain = {
  id: "0x89",
  token: "matic",
  shortName: "matic",
  label: "Polygon",
  rpcUrl: "https://polygon-rpc.com",
  blockExplorerUrl: "https://polygonscan.com",
  color: "#8248E5",
  transactionServiceUrl: "https://safe-transaction-polygon.safe.global",
  isStripePaymentsEnabled: false,
};

export const mumbaiChain: Chain = {
  id: "0x13881",
  token: "matic",
  shortName: "matic",
  label: "Mumbai",
  rpcUrl:
    "https://polygon-mumbai.g.alchemy.com/v2/SspsL-IhhMWvZpAVj9Dav1JPIZxmVuen",
  blockExplorerUrl: "https://mumbai.polygonscan.com",
  color: "#8248E5",
  isStripePaymentsEnabled: true,
  faucetUrl: "https://mumbaifaucet.com/",
};

export const sepoliaChain: Chain = {
  id: "0x11155111",
  token: "eth",
  shortName: "sep",
  label: "Sepolia",
  rpcUrl:
    "https://eth-sepolia.g.alchemy.com/v2/Bp0mI0qykz0Tbh4cFUqs5NtQI-9PfYu3",
  blockExplorerUrl: "https://sepolia.etherscan.io/",
  color: "#8248E5",
  isStripePaymentsEnabled: true,
  faucetUrl: "https://sepoliafaucet.com/",
};

const chains: Chain[] = [
  gnosisChain,
  goerliChain,
  mainnetChain,
  mumbaiChain,
  polygonChain,
  sepoliaChain,
];

export const initialChain = goerliChain;

export default chains;
