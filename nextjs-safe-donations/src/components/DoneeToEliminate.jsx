import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "@web3uikit/core";
import { ENSAvatar, Card, Button } from "web3uikit";
import abi from "../../constants/safeDonationsAbi.json";
import contractDoc from "../../constants/safeDonationsAddress.json";
import styles from "/styles/components/DoneeRequestsBox.module.css";
import { ethers } from "ethers";

export const DoneeToEliminate = ({ donee, doneeId, cause, index }) => {
  const contractAddress = contractDoc.gor.contractAddress;

  const { account, enableWeb3 } = useMoralis();
  const dispatch = useNotification();

  const { runContractFunction: removeDonee, error: eliminateDoneeError } =
    useWeb3Contract({
      contractAddress,
      abi,
      functionName: "removeDonee",
      params: { _doneeId: doneeId, _wallet: donee },
    });

  const fetchIfEliminated = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const defiContribute = new ethers.Contract(contractAddress, abi, signer);
    return await defiContribute.idToDonee(doneeId);
  };

  return (
    <div className={styles.cardContainer}>
      <Card
        style={{
          backgroundColor: "gray",
          display: "flex",
          flexDirection: "column",
          padding: "1.2rem",
          color: "yellow",
        }}
      >
        <div>
          <div className={styles.avatarId}>
            <ENSAvatar address={donee} size={50} />
            <p>#{index} Donee to eliminate</p>
          </div>
          <p>{`Address: ${donee.slice(0, 8)}...${donee.slice(-6)}`}</p>
        </div>
        <p>{`Cause: ${cause}`}</p>
        <Button
          style={{
            alignSelf: "center",
            marginTop: "1rem",
          }}
          className={styles.eliminateButton}
          text="Remove Donee"
          theme="colored"
          color="red"
          onClick={async () => {
            await enableWeb3();
            await removeDonee();
            let donee = await fetchIfEliminated(doneeId);
            if (!donee) {
              dispatch({
                type: "success",
                title: "Donee Eliminated!",
                message: `You have eliminated the donee with address ${donee.slice(
                  0,
                  6
                )}...${donee.slice(-4)}`,
                position: "topR",
              });
            } else {
              dispatch({
                type: "error",
                title: "Not in eliminated",
                message: `It seems we had an issue and you could not reject the candidate. Error: ${eliminateDoneeError}`,
                position: "topR",
              });
            }
          }}
        />
      </Card>
    </div>
  );
};
