import React from "react";
import Head from "next/head";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import styles from "/styles/layouts/MainLayout.module.css";

export const MainLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Safe Donations</title>
        <meta
          name="description"
          content="Protocol to make easy and decentralized donations."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <main className={styles.mainContainer}>{children}</main>
      <Footer />
    </>
  );
};
