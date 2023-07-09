import React from "react";
import Head from "next/head";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import styles from "/styles/layouts/AppsLayout.module.css";

export const AppsLayout = ({ children }) => {
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
