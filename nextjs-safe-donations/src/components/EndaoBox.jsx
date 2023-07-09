import styles from "/styles/components/DoneeBox.module.css";
import { Input, Modal } from "web3uikit";
import { useNotification } from "@web3uikit/core";
import { useEffect, useState } from "react";
import abi from "../../constants/safeDonationsAbi.json";
import contractDoc from "../../constants/safeDonationsAddress.json";
import { ethers } from "ethers";
import { useGlobalState } from "../utils/constants";

export const EndaoBox = ({ cause, doneeId, message, address, path }) => {
  const dispatch = useNotification();
  const contractAddress = contractDoc.gor.contractAddress;

  const [modalVisible, setModalVisible] = useState(false);
  const [amountInput, setAmountInput] = useState();
  const [msgValue, setMsgValue] = useState();
  const [redFlags, setRedFlags] = useState();
  const [signer, setSigner] = useGlobalState("signer");
  const [account, setAccount] = useGlobalState("ownerAddress");

  useEffect(() => {
    if (amountInput > 0) {
      setMsgValue(ethers.utils.parseEther(amountInput).toString());
    }
  }, [amountInput]);

  const donate = async () => {
    try {
      const tx = {
        to: address,
        value: msgValue,
      };
      const transation = await signer.sendTransaction(tx);
      const receipt = await transation.wait(2);
      dispatch({
        type: "success",
        title: "Donated!",
        message: "You have successfully donated!",
        position: "topR",
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "error",
        title: "Error",
        message: "Some error ocurred. Funds might not be enough",
        position: "topR",
      });
    }
  };

  return (
    <>
      <div className={styles.doneeContainer}>
        <div className={`${styles.causeRedFlagsContainer} ${styles.doneeItem}`}>
          <h4>{cause}</h4>
          <div className={styles.redFlagsContainer}>
            {redFlags > 0 ? (
              Array.from({ length: redFlags }, (_, i) => (
                <img
                  className={styles.redFlagImg}
                  key={i}
                  src="/red-flag.png"
                />
              ))
            ) : (
              <p>No Flags</p>
            )}
          </div>
        </div>
        <h5 className={styles.doneeItem}>Donee Id: {doneeId}</h5>
        {address.toLowerCase() === account.toLowerCase() ? (
          <h5 className={styles.doneeItem}>You</h5>
        ) : (
          <h5 className={styles.doneeItem}>
            {address.slice(0, 10)}...{address.slice(-8)}
          </h5>
        )}

        <p className={styles.doneeItem}>{message}</p>
        <div className={`${styles.buttonsContainer} ${styles.doneeItem}`}>
          {signer && signer !== "" ? (
            <>
              <button
                onClick={() => {
                  setModalVisible(true);
                }}
                className={styles.donateButton}
              >
                Donate
              </button>
            </>
          ) : (
            "Not Connected"
          )}
        </div>
      </div>
      <Modal
        className={styles.donationModal}
        id="donationModal"
        title={`You are donating to ${cause}...`}
        isVisible={modalVisible}
        okText="Donate"
        onCloseButtonPressed={() => {
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
        onOk={async () => {
          await donate();
          setModalVisible(false);
        }}
      >
        <p>Type the amount you would like to contribute with:</p>
        <div className={styles.donationInput}>
          <Input
            label="Amount on ETH"
            onChange={(event) => setAmountInput(event.target.value)}
          />
        </div>
      </Modal>
    </>
  );
};
