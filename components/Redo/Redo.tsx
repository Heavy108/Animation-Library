"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import styles from "./redo.module.css";
import InkwellGallery from "../InkwellGallery/InkwellGallery";

gsap.registerPlugin(ScrollTrigger);

export default function Redo() {
  const containerRef = useRef<HTMLDivElement>(null);

useGSAP(
  () => {
    const cardContainer = ".card-container";
    const stickyHeader = ".sticky-header h1";

    let isGapAnimationCompleted = false;
    let isFlipAnimationCompleted = false;

    function initAnimations() {
      ScrollTrigger.getAll().forEach((t) => t.kill());

      const mm = gsap.matchMedia();

      // ================= MOBILE =================

      mm.add("(max-width: 999px)", () => {
        gsap.set(".card, .card-container, .sticky-header h1, .outro", {
          clearProps: "all",
        });

        const cards = gsap.utils.toArray(".card");

        const card1Dest = -80;

        if (cards.length > 1) {
          gsap.set("#card-1", { rotationZ: -2 });
          gsap.set("#card-2", { rotationZ: 2 });
          gsap.set("#card-3", { rotationZ: -2 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".sticky",
              start: "top 5%",
              end: `+=${window.innerHeight * 1.5}`,
              scrub: 1,
              pin: true,
            },
          });

          tl.to(
            "#card-1",
            {
              y: card1Dest,
              rotationZ: -4,
              scale: 0.9,
              ease: "none",
              duration: 1,
            },
            0,
          );

          tl.to(
            "#card-2",
            {
              y: () => -(cards[1].offsetTop - cards[0].offsetTop) + card1Dest,
              rotationZ: 4,
              scale: 0.95,
              ease: "none",
              duration: 1,
            },
            0,
          );

          tl.to(
            "#card-3",
            {
              y: () => -(cards[2].offsetTop - cards[0].offsetTop) + card1Dest,
              rotationZ: -2,
              scale: 1,
              ease: "none",
              duration: 1,
            },
            0,
          );

          tl.to(
            ".outro",
            {
              marginTop: () =>
                -(cards[2].offsetTop - cards[0].offsetTop) + card1Dest,
              duration: 1,
              ease: "none",
            },
            0,
          );
        }
      });

      // ================= DESKTOP =================

      mm.add("(min-width: 1000px)", () => {
        ScrollTrigger.create({
          trigger: ".sticky",
          start: "top top",
          end: `+=${window.innerHeight * 4}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,

          onUpdate: (self) => {
            const progress = self.progress;

            if (progress >= 0.1 && progress <= 0.25) {
              const p = gsap.utils.mapRange(0.1, 0.25, 0, 1, progress);

              gsap.set(stickyHeader, {
                y: gsap.utils.mapRange(0, 1, 40, 0, p),
                opacity: gsap.utils.mapRange(0, 1, 0, 1, p),
              });
            }

            if (progress <= 0.25) {
              const w = gsap.utils.mapRange(0, 0.25, 65, 70, progress);

              gsap.set(cardContainer, {
                width: `${w}%`,
                maxWidth: "1200px",
              });
            } else {
              gsap.set(cardContainer, {
                width: "70%",
                maxWidth: "1200px",
              });
            }

            if (progress >= 0.35 && !isGapAnimationCompleted) {
              gsap.to(cardContainer, { gap: "20px" });

              gsap.to(["#card-1", "#card-2", "#card-3"], {
                borderRadius: "20px",
              });

              isGapAnimationCompleted = true;
            }

            if (progress < 0.35 && isGapAnimationCompleted) {
              gsap.to(cardContainer, { gap: "0px" });

              isGapAnimationCompleted = false;
            }

            if (progress >= 0.7 && !isFlipAnimationCompleted) {
              gsap.to(".card", {
                rotationY: 180,
                stagger: 0.1,
              });

              isFlipAnimationCompleted = true;
            }

            if (progress < 0.7 && isFlipAnimationCompleted) {
              gsap.to(".card", {
                rotationY: 0,
                stagger: -0.1,
              });

              isFlipAnimationCompleted = false;
            }
          },
        });
      });
    }

    initAnimations();

    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        initAnimations();
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  },
  { scope: containerRef },
);

  return (
    <div className={styles.container} ref={containerRef}>
      <section className={`${styles.section} ${styles.intro}`}>
        <h1>Every idea begins as a single image</h1>
      </section>

      <section className={`${styles.section} ${styles.sticky} sticky`}>
        <div className={`${styles.stickyHeader} sticky-header`}>
          <h1>Three pillars with one purpose</h1>
        </div>

        <div className={`${styles.cardContainer} card-container`}>
          <div className={`${styles.card} card`} id="card-1">
            <div className={styles.cardFront}>
              <Image
                src="/card_cover_1.jpg"
                alt=""
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className={`${styles.cardBack} card-back`}>
              <div className={styles.backContent}>
                <Image
                  src="/img1.jpeg"
                  width={160}
                  height={160}
                  alt="service"
                  className={styles.backImage}
                />

                <div className={styles.introduction}>
                  <h5>Gratitude</h5>
                  <p>
                    Choosing appreciation over complaint. Seeing blessings even
                    in challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.card} card`} id="card-2">
            <div className={styles.cardFront}>
              <Image
                src="/card_cover_2.jpg"
                alt=""
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className={`${styles.cardBack} card-back`}>
              <div className={styles.backContent}>
                <Image
                  src="/img2.jpeg"
                  width={160}
                  height={160}
                  alt="service"
                  className={styles.backImage}
                />

                <div className={styles.introduction}>
                  <h5>Peace</h5>
                  <p>
                    A calm mind brings clarity, balance, and strength in every
                    situation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.card} card`} id="card-3">
            <div className={styles.cardFront}>
              <Image
                src="/card_cover_3.jpg"
                alt=""
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className={`${styles.cardBack} card-back`}>
              <div className={styles.backContent}>
                <Image
                  src="/img3.jpeg"
                  width={160}
                  height={160}
                  alt="service"
                  className={styles.backImage}
                />

                <div className={styles.introduction}>
                  <h5>Service</h5>
                  <p>
                    True growth comes when we uplift others with compassion and
                    care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Added 'outro' class here so GSAP can pull it up and collapse the empty space */}
      <section className={`${styles.section} ${styles.outro} outro`}>
        <h1>Every transition leaves a trace</h1>
        {/* <InkwellGallery /> */}
      </section>
    </div>
  );
}
