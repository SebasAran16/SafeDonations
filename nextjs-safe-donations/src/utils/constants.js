import { createGlobalState } from "react-hooks-global-state";

const { useGlobalState } = createGlobalState({
  safes: "",
  authClient: "",
  web3Provider: "",
  ownerAddress: "",
  chainId: "",
  signer: "",
  balance: 0,
});

export { createGlobalState, useGlobalState };
