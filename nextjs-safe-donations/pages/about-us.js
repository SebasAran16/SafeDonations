import styles from "/styles/About.module.css";
import { AppsLayout } from "../src/layouts/apps-layout";

export default function AboutUs() {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentContainer}>
        <h1>Defi Donation Protocol</h1>
        <section className={styles.whatContent}>
          <h2>What are we?</h2>
          <p>
            We are a protocol that works on Blockchain, enabling the user to
            view, verify and track every transaction that happens either on our
            protocol or in the main metwork, and that uses this technology to
            provide a place where users can both chosee Donees and donate to
            them directly and verifiably
          </p>
        </section>
        <section className={styles.whyContent}>
          <h2>Why is this protocol necessary?</h2>
          <p>
            Everytime it is becoming easily to notice how some money transfer
            work, as the transfer is not totally transparent and data is not
            totally true, people in between can corrupt the whole system
            <br />
            <br />
            This possibilities would not be able to take place in a system
            operating over Blockchain, an this is what this protocol allows.
          </p>
        </section>
        <section className={styles.howContent}>
          <h2>How does it work?</h2>
          <ul className={styles.mainUList}>
            <li>
              Few admins will be picked at deployment for them to be able to
              approve some Donees.
            </li>
            <li>
              First Donees interacting with the protocol will generate a Token
              that will be released to them.
            </li>
            <li>
              The Token will have the following utilities:
              <ul className={styles.secondUList}>
                <li>
                  Allow user to choose new Donees: Votes will be taken in count
                  after some amount of tokens, but votations will have a greater
                  impact when having more tokens than sufficient
                </li>
                <li>Work as currency to donate in its corresponding change</li>
                <li>Postulate as Donee</li>
              </ul>
            </li>
          </ul>
        </section>
      </div>
      <aside className={styles.aside}></aside>
    </div>
  );
}

AboutUs.getLayout = function getLayout(page) {
  return <AppsLayout>{page}</AppsLayout>;
};
