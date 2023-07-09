import React from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import Head from "next/head";
import styles from "/styles/layouts/DonateLayout.module.css";

export const DonateLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Defi Donate Protocol</title>
        <meta
          name="description"
          content="Protocol to make easy and decentralized donations."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <main className={styles.mainContainer}>
        <div id={styles.children}>{children}</div>
      </main>
      <Footer />
    </>
  );
};
