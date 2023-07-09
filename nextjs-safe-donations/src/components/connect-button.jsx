import { useEffect, useState } from "react";
import { useMoralis, useNativeBalance } from "react-moralis";
import { useNotification } from "@web3uikit/core";
import { ENSAvatar } from "web3uikit";
import styles from "/styles/ConnectButton.module.css";
import Image from "next/image";
import { Web3AuthOptions } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { SafeAuthKit, Web3AuthModalPack } from "@safe-global/auth-kit";
import { useCallback } from "react";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import getChain from "../utils/getChain";
import { initialChain } from "../chains/chains";
import { ethers } from "ethers";
import { useGlobalState, createGlobalState } from "../utils/constants";

export const ConnectButton = () => {
  const {
    enableWeb3,
    isWeb3Enabled,
    account,
    isInitialized,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  const [safes, setSafes] = useGlobalState("safes");
  const [authClient, setAuthClient] = useGlobalState("authClient");
  const [web3Provider, setWeb3Provider] = useGlobalState("web3Provider");
  const [ownerAddress, setOwnerAddress] = useGlobalState("ownerAddress");
  const [chainId, setChainId] = useGlobalState("chainId");
  const [signer, setSigner] = useGlobalState("signer");

  const loginWeb3Auth = useCallback(async () => {
    const chain = getChain(initialChain.id);
    try {
      const options = {
        clientId:
          process.env.WEB3_CLIENT_ID ||
          "BJWC1HoHqSAsIpg8aH-xtZ4l5csAVvc1Jr55LlRi04iFeX0RaArVavDJDUSoHdi6_omluxrYl4XVoBirXqvblf4",
        web3AuthNetwork: "testnet",
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: chain.id,
          rpcTarget: chain.rpcUrl,
        },
        uiConfig: {
          theme: "dark",
          loginMethodsOrder: ["google", "facebook"],
        },
      };

      const modalConfig = {
        [WALLET_ADAPTERS.TORUS_EVM]: {
          label: "torus",
          showOnModal: false,
        },
        [WALLET_ADAPTERS.METAMASK]: {
          label: "metamask",
          showOnDesktop: true,
          showOnMobile: false,
        },
      };

      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: "mandatory",
        },
        adapterSettings: {
          uxMode: "popup",
          whiteLabel: {
            name: "Safe",
          },
        },
      });

      const web3AuthModalPack = new Web3AuthModalPack(
        options,
        [openloginAdapter],
        modalConfig
      );

      const safeAuth = await SafeAuthKit.init(web3AuthModalPack);

      if (safeAuth) {
        const { safes, eoa } = await safeAuth.signIn();
        const provider = safeAuth.getProvider();
        console.log(eoa);

        setChainId(chain.id);
        setOwnerAddress(eoa);
        setSafes(safes || []);
        setWeb3Provider(new ethers.providers.Web3Provider(provider));
        setAuthClient(safeAuth);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }, [account]);

  const dispatch = useNotification();

  useEffect(() => {
    if (isWeb3Enabled) {
      window.localStorage.setItem("connected", "injected");
      return;
    }

    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected") == "injected") {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    if (account == null) {
      window.localStorage.removeItem("connected");
      deactivateWeb3();
    }
  }, [account]);

  const connectMetamask = async () => {
    try {
      await enableWeb3();
      window.localStorage.setItem("connected", "injected");
      dispatch({
        type: "info",
        message: "You have successfully connected!",
        title: "Wallet Connected!",
        position: "topR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (web3Provider) {
      const signer = web3Provider.getSigner();
      setSigner(signer);
    }
  }, [web3Provider]);

  const disconnect = async () => {
    try {
      await authClient.signOut();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = async () => {
    const modal = document.querySelector(`#${styles.authenticationModal}`);
    modal.classList.toggle(styles.hiddenModal);
  };

  const hideModal = async () => {
    const modal = document.querySelector(`#${styles.authenticationModal}`);
    modal.classList.add(styles.hiddenModal);
  };

  return (
    <>
      {ownerAddress ? (
        <div className={styles.accountContainer}>
          <div id={styles.avatarAndAddress}>
            <ENSAvatar address={ownerAddress} size={30} />
            <p>{`${ownerAddress.slice(0, 6)}...${ownerAddress.slice(-4)}`}</p>
          </div>

          <button id={styles.disconnectButton} onClick={disconnect}>
            Disconnect
          </button>
        </div>
      ) : (
        <button id={styles.connectButton} onClick={loginWeb3Auth}>
          Authenticate
        </button>
      )}
      <div id={styles.authenticationModal} className={styles.hiddenModal}>
        <div id={styles.authenticateContent}>
          <section id={styles.topSection}>
            <img
              id={styles.closeModalCross}
              src="/cross-icon.png"
              onClick={hideModal}
            />
          </section>
          <section id={styles.mailPhoneSection}>
            <h3>Safe</h3>
            <button onClick={loginWeb3Auth}></button>
          </section>
          <section id={styles.metamaskSection}>
            <h3>Wallet</h3>
            <button onClick={connectMetamask}>Connect Wallet</button>
          </section>
        </div>
      </div>
    </>
  );
};
