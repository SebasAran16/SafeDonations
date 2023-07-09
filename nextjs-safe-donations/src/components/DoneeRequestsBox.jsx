import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "@web3uikit/core";
import { ENSAvatar, Card, Button } from "web3uikit";
import abi from "../../constants/safeDonationsAbi.json";
import contractDoc from "../../constants/safeDonationsAddress.json";
import styles from "/styles/components/DoneeRequestsBox.module.css";
import { useGlobalState } from "../utils/constants";
import { ethers } from "ethers";

export const DoneeRequestBox = ({ donee, message, index }) => {
  // const abi = abiDoc.abi;
  const contractAddress = contractDoc.gor.contractAddress;

  const dispatch = useNotification();
  const [account, setAccount] = useGlobalState("ownerAddress");
  const [signer, setSigner] = useGlobalState("signer");

  const rejectDonee = async () => {
    try {
      const defiContribute = new ethers.Contract(contractAddress, abi, signer);
      const rejectReq = await defiContribute.rejectDonee(donee);
      const receipt = await rejectReq.wait(1);
      dispatch({
        type: "success",
        title: "Donee Rejected",
        message: "Donee rejected correctly",
        position: "topR",
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "error",
        title: "Error",
        message: "Some error ocurred. Could not reject donee",
        position: "topR",
      });
    }
  };

  const approveDonee = async () => {
    try {
      const defiContribute = new ethers.Contract(contractAddress, abi, signer);
      const approvetReq = await defiContribute.approveDonee(donee);
      const receipt = await approvetReq.wait(1);
      dispatch({
        type: "success",
        title: "Donee Approved",
        message: "Donee approved correctly",
        position: "topR",
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "error",
        title: "Error",
        message: "Some error ocurred. Could not approve donee",
        position: "topR",
      });
    }
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
        cursorType={"default"}
      >
        <div>
          <div className={styles.avatarId}>
            <ENSAvatar address={donee} size={50} />
            <p>#{index} Donee Request</p>
          </div>
          <p>{`Address: ${donee.slice(0, 8)}...${donee.slice(-6)}`}</p>
          <p>{`Message: ${message}`}</p>
        </div>
        <div className={styles.buttonsContainer}>
          <Button
            text="Reject"
            theme="colored"
            color="red"
            onClick={async () => {
              await rejectDonee();
            }}
          />
          <Button
            text="Accept"
            theme="colored"
            color="green"
            onClick={async () => {
              await approveDonee();
            }}
          />
        </div>
      </Card>
    </div>
  );
};
