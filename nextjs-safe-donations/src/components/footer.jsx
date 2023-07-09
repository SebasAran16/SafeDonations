import React from "react";
import Link from "next/link";
import styles from "/styles/Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* This will have an email form with icons */}
      <p>
        Protocol created by{" "}
        <Link href="https://twitter.com/Sebas_aran16" target="_blank">
          @Sebas_aran16
        </Link>
      </p>
    </footer>
  );
};
