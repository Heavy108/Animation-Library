"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import styles from "./redo.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Redo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Lenis Setup
      const lenis = new Lenis();
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      const cardContainer = ".card-container";
      const stickyHeader = ".sticky-header h1";
      let isGapAnimationCompleted = false;
      let isFlipAnimationCompleted = false;

      function initAnimations() {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

        const mm = gsap.matchMedia();

        // ----------------------------------------------------
        // MOBILE ANIMATION: Complete Overlapping Stack + Shrink Height
        // ----------------------------------------------------
        mm.add("(max-width: 999px)", () => {
          gsap.set(".card, .card-container, .sticky-header h1, .outro", {
            clearProps: "all",
          });

          const cards = gsap.utils.toArray(".card") as HTMLElement[];

          // How far up the FIRST card travels.
          const card1Dest = -80;

          if (cards.length > 1) {
            // Initial tilts before scrolling starts (matches your image perfectly)
            gsap.set("#card-1", { rotationZ: -2 });
            gsap.set("#card-2", { rotationZ: 2 });
            gsap.set("#card-3", { rotationZ: -2 });

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: ".sticky",
                start: "top 5%",
                end: `+=${window.innerHeight * 1.5}px`,
                scrub: 1,
                pin: true,
              },
            });

            // Stage 1: Card 1 moves to its target
            tl.to(
              "#card-1",
              {
                y: card1Dest,
                rotationZ: -4, // Final tilt (Bottom Card)
                scale: 0.9,
                ease: "none",
                duration: 1,
              },
              0, // All start at 0 simultaneously
            );

            // Stage 2: Card 2 completely closes the gap and overlaps Card 1
            tl.to(
              "#card-2",
              {
                y: () => -(cards[1].offsetTop - cards[0].offsetTop) + card1Dest,
                rotationZ: 4, // Final tilt (Middle Card)
                scale: 0.95,
                ease: "none",
                duration: 1,
              },
              0,
            );

            // Stage 3: Card 3 completely closes the gap and overlaps the stack
            tl.to(
              "#card-3",
              {
                y: () => -(cards[2].offsetTop - cards[0].offsetTop) + card1Dest,
                rotationZ: -2, // Final tilt (Top Card)
                scale: 1,
                ease: "none",
                duration: 1,
              },
              0,
            );

            // Stage 4: THE MAGIC TRICK to fix the empty space!
            // We pull the outro section up by the exact distance the cards condensed.
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

          return () => {};
        });

        // ----------------------------------------------------
        // DESKTOP ANIMATION: Original (Untouched)
        // ----------------------------------------------------
        mm.add("(min-width: 1000px)", () => {
          ScrollTrigger.create({
            trigger: ".sticky",
            start: "top top",
            end: `+=${window.innerHeight * 4}px`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            onUpdate: (self) => {
              const progress = self.progress;

              if (progress >= 0.1 && progress <= 0.25) {
                const headerProgress = gsap.utils.mapRange(
                  0.1,
                  0.25,
                  0,
                  1,
                  progress,
                );
                const yValue = gsap.utils.mapRange(0, 1, 40, 0, headerProgress);
                const opacityValue = gsap.utils.mapRange(
                  0,
                  1,
                  0,
                  1,
                  headerProgress,
                );

                gsap.set(stickyHeader, {
                  y: yValue,
                  opacity: opacityValue,
                });
              } else if (progress < 0.1) {
                gsap.set(stickyHeader, {
                  y: 40,
                  opacity: 0,
                });
              } else if (progress > 0.25) {
                gsap.set(stickyHeader, {
                  y: 0,
                  opacity: 1,
                });
              }

              if (progress <= 0.25) {
                const widthPercentage = gsap.utils.mapRange(
                  0,
                  0.25,
                  75,
                  60,
                  progress,
                );
                gsap.set(cardContainer, { width: `${widthPercentage}%` });
              } else {
                gsap.set(cardContainer, { width: "60%" });
              }

              if (progress >= 0.35 && !isGapAnimationCompleted) {
                gsap.to(cardContainer, {
                  gap: "20px",
                  duration: 0.5,
                  ease: "power3.out",
                });
                gsap.to(["#card-1", "#card-2", "#card-3"], {
                  borderRadius: "20px",
                  duration: 0.5,
                  ease: "power3.out",
                });
                isGapAnimationCompleted = true;
              } else if (progress < 0.35 && isGapAnimationCompleted) {
                gsap.to(cardContainer, {
                  gap: "0px",
                  duration: 0.5,
                  ease: "power3.out",
                });
                gsap.to("#card-1", {
                  borderRadius: "20px 0 0 20px",
                  duration: 0.5,
                  ease: "power3.out",
                });
                gsap.to("#card-2", {
                  borderRadius: "0px",
                  duration: 0.5,
                  ease: "power3.out",
                });
                gsap.to("#card-3", {
                  borderRadius: "0 20px 20px 0",
                  duration: 0.5,
                  ease: "power3.out",
                });
                isGapAnimationCompleted = false;
              }

              if (progress >= 0.7 && !isFlipAnimationCompleted) {
                gsap.to(".card", {
                  rotationY: 180,
                  duration: 0.75,
                  ease: "power3.inOut",
                  stagger: 0.1,
                });
                gsap.to(["#card-1", "#card-3"], {
                  y: 30,
                  rotationZ: (i) => [-15, 15][i],
                  duration: 0.75,
                  ease: "power3.inOut",
                });
                isFlipAnimationCompleted = true;
              } else if (progress < 0.7 && isFlipAnimationCompleted) {
                gsap.to(".card", {
                  rotationY: 0,
                  duration: 0.75,
                  ease: "power3.inOut",
                  stagger: -0.1,
                });
                gsap.to(["#card-1", "#card-3"], {
                  y: 0,
                  rotationZ: 0,
                  duration: 0.75,
                  ease: "power3.inOut",
                });
                isFlipAnimationCompleted = false;
              }
            },
          });
          return () => {};
        });
      }

      initAnimations();

      let resizeTimer: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          initAnimations();
        }, 250);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        lenis.destroy();
        gsap.ticker.remove((time) => lenis.raf(time * 1000));
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
              <span>( 01 )</span>
              <p>Interactive Web Experiences</p>
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
              <span>( 02 )</span>
              <p>Thoughtful Design Language</p>
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
              <span>( 03 )</span>
              <p>Visual Design Systems</p>
            </div>
          </div>
        </div>
      </section>

      {/* Added 'outro' class here so GSAP can pull it up and collapse the empty space */}
      <section className={`${styles.section} ${styles.outro} outro`}>
        <h1>Every transition leaves a trace</h1>
      </section>
    </div>
  );
}
