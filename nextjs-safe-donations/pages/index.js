import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

export default function Home() {
  return (
    <div className={styles.mainContainer}>
      <section id={styles.introSection}>
        <div id={styles.introContent}>
          <h2>Verifiable, secure, easy and decentralized</h2>
          <h4>Doners need to verify that help arrives to the right person</h4>
          <br />
          <h4>Making giving go viral</h4>
        </div>
      </section>
      <section id={styles.explanationContainer}>
        <h2>What doesthis protocol do?</h2>
        <Swiper
          id={styles.swiper}
          effect="cube"
          grabCursor={true}
          autoplay={{ delay: 5000, disableOnInteraction: true }}
          slidesPerView={1}
          onSlideChange={() => console.log("slide change")}
          modules={[Navigation]}
          navigation
        >
          <SwiperSlide>
            <div className={styles.protocolAction}>
              <Image
                className={styles.protocolImg}
                src="/donate-icon.png"
                alt="Donate Icon"
                width="62"
                height="62"
              />
              <div className={styles.skillContent}>
                <h3>Donate</h3>
                <p>
                  Every person who access our protocol is able to donate to the
                  selected donees safely in Blockchain with few clicks.
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.protocolAction}>
              <Image
                className={styles.protocolImg}
                src="/receive-icon.png"
                alt="Receive Icon"
                width="62"
                height="62"
              />
              <div className={styles.skillContent}>
                <h3>Receive</h3>
                <p>
                  Send a From petition to be evaluated and acepted or declined
                  by governance token holders.
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.protocolAction}>
              <Image
                className={styles.protocolImg}
                src="/select-icon.png"
                alt="Filter Icon"
                width="62"
                height="62"
              />
              <div className={styles.skillContent}>
                <h3>Select Donees</h3>
                <p>
                  The verified accounts from each Goverment Node will be able to
                  select the donees depending on the pesons's situations.
                </p>
              </div>
            </div>
          </SwiperSlide>
          {/* <SwiperSlide>
            <div className={styles.protocolAction}>
              <Image
                className={styles.protocolImg}
                src="/flag-icon.png"
                alt="Flag Icon"
                width="62"
                height="62"
              />
              <div className={styles.skillContent}>
                <h3>Flag Donees</h3>
                <p>
                  This users with the token will be able to submit a flag
                  petition for a donee to an admin.
                </p>
              </div>
            </div>
          </SwiperSlide> */}
          <SwiperSlide>
            <div className={styles.protocolAction}>
              <Image
                className={styles.protocolImg}
                src="/eliminate-icon.png"
                alt="X Icon"
                width="62"
                height="62"
              />
              <div className={styles.actionContent}>
                <h3>Eliminate Donees</h3>
                <p>
                  In a similar way, eliminatin petitions can be sent with the
                  token for admins to review and eliminate a Donee.
                </p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
      <section className={styles.testContainer}>
        <Image
          src="/ilustration-image.jpg"
          alt="Picture of a hand giving"
          width="200"
          height="300"
        />
      </section>
      <section id={styles.toolsContainer}>
        <h3>This is what is needed for creating the DApp:</h3>
        <article className={styles.skillsBox}>
          <div className={styles.mainLeft}>
            <div className={styles.top}>
              <figure className={`${styles.skill} ${styles.t1}`}>
                <div className={styles.personInfoDiv}>
                  <figcaption className={styles.skillDescription}>
                    <p className={`${styles.skillName} ${styles.pl}`}>
                      Solidity
                    </p>
                    <p className={`${styles.status} ${styles.pt}`}>
                      Programming Language for EVM
                    </p>
                  </figcaption>
                </div>
                <blockquote className={styles.skillContent}>
                  <p className={styles.skillBody}>
                    Most knowN and used language for creating Smart Contracts on
                    EVM compatible Blockchains. It was required me to learn
                    security when creating the applications and basic
                    optimization for cheaper deployment and use.
                  </p>
                </blockquote>
              </figure>
              <figure className={`${styles.skill} ${styles.t2}`}>
                <div className={styles.personInfoDiv}>
                  <figcaption className={styles.skillDescription}>
                    <p className={styles.skillName}>Safe</p>
                    <p className={styles.status}>Features</p>
                  </figcaption>
                </div>
                <blockquote className={styles.skillContent}>
                  <p className={styles.skillBody}>
                    An amazing tool for making the UX smooth and easy.
                  </p>
                </blockquote>
              </figure>
            </div>
            <div className={styles.bottom}>
              <figure className={`${styles.skill} ${styles.t3}`}>
                <div className={styles.personInfoDiv}>
                  <figcaption className={styles.skillDescription}>
                    <p className={styles.skillName}>Web3 Libraries</p>
                    <p className={styles.status}></p>
                  </figcaption>
                </div>
                <blockquote className={styles.skillContent}>
                  <p className={styles.skillBody}>
                    Tools such as EthersJs, Moralis, Web3UIKit is a needed
                    knowledge.
                  </p>
                </blockquote>
              </figure>
              <figure className={`${styles.skill} ${styles.t4}`}>
                <div className={styles.personInfoDiv}>
                  <figcaption className={styles.skillDescription}>
                    <p className={styles.skillName}>NextJs</p>
                    <p className={styles.status}>Framework on top of React</p>
                  </figcaption>
                </div>
                <blockquote className={styles.skillContent}>
                  <p className={styles.skillBody}>
                    Enables you to create full-stack web applications by
                    extending the latest React features, and integrating
                    powerful Rust-based JavaScript tooling for the fastest
                    builds.
                  </p>
                </blockquote>
              </figure>
            </div>
          </div>
          <figure className={`${styles.skill} ${styles.t5}`}>
            <div className={styles.personInfoDiv}>
              <figcaption className={styles.skillDescription}>
                <p className={styles.skillName}>Thegraph + GraphQl</p>
                <p className={styles.status}>Web3 Tool</p>
              </figcaption>
            </div>
            <blockquote className={styles.skillContent}>
              <p className={styles.skillBody}>
                An amazing protocol that allow us to index data directly from
                the Blockchain by hearing the events of the contract. Also,
                GraphQl which allows us to uery that information.
              </p>
            </blockquote>
          </figure>
        </article>
      </section>
    </div>
  );
}
