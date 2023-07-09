import { useMoralis, useWeb3Contract } from "react-moralis";
import { gql, useQuery } from "@apollo/client";
import abi from "../../constants/safeDonationsAbi.json";
import contractDoc from "../../constants/safeDonationsAddress.json";
import { ethers } from "ethers";
import { ENSAvatar } from "web3uikit";
import { useNotification } from "@web3uikit/core";
import { useEffect, useState } from "react";
import styles from "/styles/Donees.module.css";
import { AppsLayout } from "../../src/layouts/apps-layout";
import { useGlobalState } from "../../src/utils/constants";

export default function Donees() {
  const [account, setAccount] = useGlobalState("ownerAddress");
  const [signer, setSigner] = useGlobalState("signer");

  const contractAddress = contractDoc.gor.contractAddress;

  const DONEE_QUERY = gql`
    query Donee($donee: String!) {
      activeDonees(where: { donee: $donee }) {
        donee
        doneeId
        cause
        message
      }
    }
  `;

  const withdraw = async () => {
    try {
      const defiContribute = new ethers.Contract(contractAddress, abi, signer);
      const rejectReq = await defiContribute.withdraw();
      const receipt = await rejectReq.wait(1);
      dispatch({
        type: "success",
        title: "Withdrawn",
        message: "Congrats! Funds withdrawn",
        position: "topR",
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "error",
        title: "Error",
        message: "Some error ocurred. Could not withdraw",
        position: "topR",
      });
    }
  };

  const dispatch = useNotification();

  const { loading, error, data } = useQuery(DONEE_QUERY, {
    variables: { donee: account },
  });

  const [isDonee, setIsDonee] = useState(false);
  let [doneeId, setDoneeId] = useState("");
  const [doneeProceeds, setDoneeProceeds] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) location.reload();
  }, [account]);

  return (
    <div className={styles.mainContainer}>
      <button
        className={`${styles.authenticateButton}`}
        onClick={async () => {
          if (signer) {
            const defiContribute = new ethers.Contract(
              contractAddress,
              abi,
              signer
            );
            let id = await defiContribute.addressToDoneeId(account);
            id = parseInt(id, 16);
            setDoneeId(id);
            if (id > 0) {
              setIsDonee(true);
            }
            const button = document.querySelector(
              ".Donees_authenticateButton__rwZHI"
            );
            button.classList.add("Donees_hiddenAuthenticateButton__w8q75");
            const content = document.querySelector(
              ".Donees_contentContainer__4uIfu"
            );
            content.classList.remove("Donees_hiddenContentContainer__vDrnN");
            const donee = await defiContribute.idToDonee(id);
            setDoneeProceeds(donee.proceeds);
            setIsAuthenticated(true);
          }
        }}
      >
        Confirm Donee Status
      </button>
      <section
        className={`${styles.contentContainer} ${styles.hiddenContentContainer}`}
      >
        {isDonee ? (
          <>
            <section className={styles.doneeInfoContainer}>
              <div className={styles.imageAndAcc}>
                <ENSAvatar address={account} size={50} />{" "}
                <h3>{`Address: ${data.activeDonees[0].donee.slice(
                  0,
                  8
                )}...${data.activeDonees[0].donee.slice(-6)}`}</h3>
              </div>
              <div className={styles.doneeInfo}>
                <h2>{`Cause: ${data.activeDonees[0].cause}`}</h2>
                <p>{`Message: ${data.activeDonees[0].message}`}</p>
              </div>
            </section>
            <section className={styles.withdrawalContainer}>
              <h1>Proceeds</h1>
              {doneeProceeds > 0 ? (
                <div className={styles.withdrawal}>
                  <p>{`You have ${ethers.utils.formatEther(
                    doneeProceeds.toString()
                  )} ETH in proceeds to withdraw.`}</p>
                  <button
                    className={styles.withdrawButton}
                    onClick={async () => {
                      const provider = new ethers.providers.Web3Provider(
                        window.ethereum
                      );
                      const signer = provider.getSigner();
                      const defiContribute = new ethers.Contract(
                        contractAddress,
                        abi,
                        signer
                      );
                      const freezeTime =
                        await defiContribute.doneeToWithdrawalFreeze(doneeId);
                      if (freezeTime > 0) {
                        dispatch({
                          type: "error",
                          title: "Withdrawal Freezed!",
                          message: `You can not withdraw as you have ${freezeTime} freeze time.`,
                          position: "topR",
                        });
                      } else {
                        await enableWeb3();
                        await withdraw({
                          onError: (error) => {
                            dispatch({
                              type: "error",
                              title: "You could not withdraw",
                              message:
                                "An error occurred when trying to withdraw.",
                              position: "topR",
                            });
                            console.log(error);
                          },
                          onSuccess: () => {
                            dispatch({
                              type: "success",
                              title: "You have withdrawn correctly!",
                              message: `You have withdrawn ${ethers.utils.formatEther(
                                doneeProceeds.toString()
                              )} ETH successfully!`,
                              position: "topR",
                            });
                          },
                        });
                      }
                    }}
                  >
                    Withdraw
                  </button>
                </div>
              ) : (
                <p>You have no proceeds to withdraw...</p>
              )}
            </section>
          </>
        ) : (
          <p>You are not a donee</p>
        )}
      </section>
    </div>
  );
}

Donees.getLayout = function getLayout(page) {
  return <AppsLayout>{page}</AppsLayout>;
};
