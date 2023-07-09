import { useMoralis, useWeb3Contract } from "react-moralis";
import { gql, useQuery } from "@apollo/client";
import abi from "../../constants/safeDonationsAbi.json";
import contractDoc from "../../constants/safeDonationsAddress.json";
import { ethers } from "ethers";
import { ENSAvatar, Form } from "web3uikit";
import { useNotification } from "@web3uikit/core";
import { useEffect, useState } from "react";
import { DoneeRequestBox } from "../../src/components/DoneeRequestsBox";
import { DoneeToEliminate } from "../../src/components/DoneeToEliminate";
import styles from "/styles/Admin.module.css";
import { AppsLayout } from "../../src/layouts/apps-layout";
import { useGlobalState } from "../../src/utils/constants";

export default function AdminPage() {
  const [account, setAccount] = useGlobalState("ownerAddress");
  const [signer, setSigner] = useGlobalState("signer");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const contractAddress = contractDoc.gor.contractAddress;

  const ADMIN_QUERY = gql`
    query Admim($admin: String!) {
      activeAdmins(where: { admin: $admin }) {
        admin
      }
    }
  `;

  const ACTIVE_DONEE_REQUESTS_QUERY = gql`
    {
      activeDoneeRequests(
        where: { donee_not: "0x000000000000000000000000000000000000dead" }
      ) {
        donee
        message
      }
    }
  `;

  const ACTIVE_DONEES_QUERY = gql`
    {
      activeDonees {
        donee
        doneeId
      }
    }
  `;

  const READY_TO_REMOVE_QUERY = gql`
    {
      readyToRemoves {
        doneeId
        donee
        cause
      }
    }
  `;

  const dispatch = useNotification();

  const {
    loading: doneeRequestsLoading,
    error: doneeRequestsError,
    data: adminData,
  } = useQuery(ADMIN_QUERY, {
    variables: { admin: account },
  });

  const {
    loading: activeDoneesLoading,
    error: activeDoneesError,
    data: activeDonees,
  } = useQuery(ACTIVE_DONEES_QUERY);

  const {
    loading: removeDoneesLoading,
    error: removeDoneesError,
    data: doneesToRemove,
  } = useQuery(READY_TO_REMOVE_QUERY);

  const { data: requestsData } = useQuery(ACTIVE_DONEE_REQUESTS_QUERY);

  const [isAdmin, setIsAdmin] = useState(false);

  console.log(adminData);

  useEffect(() => {
    if (isAuthenticated) location.reload();
  }, [account]);

  const addRedFlag = async (data) => {
    const id = data.data[0].inputResult;
    const doneeWallet = data.data[1].inputResult;
    const isId = activeDonees.activeDonees.find((donee) => donee.doneeId == id);
    const isDonee = activeDonees.activeDonees.find(
      (donee) => doneeWallet.toLowerCase() == donee.donee.toLowerCase()
    );
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const defiContribute = new ethers.Contract(contractAddress, abi, signer);
    if (isId && isDonee) {
      try {
        await defiContribute.addRedFlag(id, doneeWallet);
      } catch (error) {
        console.log(error);
        return;
      }
      dispatch({
        type: "success",
        title: "Red Flag Added!",
        message: `You added the Red Flag to the donee with ID: ${id} succesfully!`,
        position: "topR",
      });
    } else if (isId && !isDonee) {
      dispatch({
        type: "error",
        title: "Wrong Address",
        message: "The donee address provided does not correspond to any donee.",
        position: "topR",
      });
    } else if (!isId && isDonee) {
      dispatch({
        type: "error",
        title: "Wrong ID",
        message: "The donee ID provided does not correspond to any donee.",
        position: "topR",
      });
    } else {
      dispatch({
        type: "error",
        title: "Wrong Data",
        message:
          "Neither donee ID nor address provided correspond to any donee.",
        position: "topR",
      });
    }
  };

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
            let admin = await defiContribute.admin(account);
            setIsAdmin(admin);
            const button = document.querySelector(
              ".Admin_authenticateButton__pToBC"
            );
            button.classList.add("Admin_hiddenAuthenticateButton__dk4ID");
            const content = document.querySelector(
              ".Admin_contentContainer__yIaTd"
            );
            content.classList.remove("Admin_hiddenContentContainer__Xlo0p");
            setIsAuthenticated(true);
          }
        }}
      >
        Confirm Admin Status
      </button>
      <section
        className={`${styles.contentContainer} ${styles.hiddenContentContainer}`}
      >
        {isAdmin && adminData ? (
          <>
            <section className={styles.adminInfoContainer}>
              <div className={styles.imageAndAcc}>
                <ENSAvatar address={account} size={50} />{" "}
                <h4>{`Address: ${adminData.activeAdmins[0].admin.slice(
                  0,
                  8
                )}...${adminData.activeAdmins[0].admin.slice(-6)}`}</h4>
              </div>
              <div className={styles.adminInfo}>
                <h3>{`Rol: Admin`}</h3>
              </div>
            </section>
            <div className={styles.functionsGrid}>
              <section className={styles.doneeRequestsContainer}>
                <hr className={styles.separationLine}></hr>
                <h2>Donees Requests:</h2>
                <p>You can manage the following donee requests:</p>
                <div className={styles.doneeRequests}>
                  {requestsData.activeDoneeRequests.length > 0 ? (
                    requestsData.activeDoneeRequests.map((request, index) => {
                      return (
                        <DoneeRequestBox
                          key={index}
                          donee={request.donee}
                          message={request.message}
                          index={index}
                        />
                      );
                    })
                  ) : (
                    <p className={styles.noRequests}>
                      No requests to manage...
                    </p>
                  )}
                </div>
              </section>
              <section className={styles.redFlagsSection}>
                <hr className={styles.separationLine}></hr>
                <h2>Add a Red Flag:</h2>
                <div className={styles.formContainer}>
                  <Form
                    id="doneeRedFlagForm"
                    onSubmit={addRedFlag}
                    loadingText="Adding Red Flag"
                    data={[
                      {
                        inputWidth: "70%",
                        name: "Donee ID",
                        type: "number",
                        value: "",
                        key: "doneeId",
                      },
                      {
                        inputWidth: "70%",
                        name: "Donee Address",
                        type: "text",
                        value: "",
                        key: "doneeAddress",
                      },
                    ]}
                  />
                </div>
              </section>
              <section className={styles.eliminateContainer}>
                <hr></hr>
                <h2>Donees to eliminate:</h2>
                <p>
                  The following donees have 3 red flags and should be removed:
                </p>
                <div className={styles.doneesToEliminateContainer}>
                  {doneesToRemove ? (
                    doneesToRemove.readyToRemoves.map((donee, index) => {
                      return (
                        <>
                          <DoneeToEliminate
                            key={donee.doneeId}
                            donee={donee.donee}
                            doneeId={donee.doneeId}
                            cause={donee.cause}
                            index={index}
                          />
                        </>
                      );
                    })
                  ) : (
                    <p>No donees to eliminate</p>
                  )}
                </div>
              </section>
            </div>
          </>
        ) : (
          <p>You are not an admin</p>
        )}
      </section>
    </div>
  );
}

AdminPage.getLayout = function getLayout(page) {
  return <AppsLayout>{page}</AppsLayout>;
};
