"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./bentoslider.module.css";

gsap.registerPlugin(ScrollTrigger);

const BentoSlider = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

useGSAP(
  () => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 901px)", () => {
      const slides = gsap.utils.toArray<HTMLElement>(`.${styles.slide}`);

      // INITIAL STATE: Hide all slides except the first one
      gsap.set(slides, { yPercent: 105, opacity: 0 });
      gsap.set(slides[0], { yPercent: 0, opacity: 1 });

      let currentIndex = 0;

      ScrollTrigger.create({
        trigger: section,
        start: "center center",
        end: "+=1200", // Total scroll distance to pin the section
        pin: true,
        onUpdate: (self) => {
          // 1. Divide the scroll space into 3 invisible zones
          let newIndex = 0;
          if (self.progress < 0.33) newIndex = 0;
          else if (self.progress < 0.66) newIndex = 1;
          else newIndex = 2;

          // 2. Only trigger the animation if the user crosses into a NEW zone
          if (newIndex !== currentIndex) {
            // Figure out if we are scrolling down (1) or up (-1)
            const direction = newIndex > currentIndex ? 1 : -1;

            // A. Animate the OUTGOING slide away
            gsap.to(slides[currentIndex], {
              yPercent: -105 * direction, // If scrolling down, pushes up. If scrolling up, pushes down.
              opacity: 0,
              duration: 0.6,
              ease: "power2.inOut",
            });

            // B. Instantly move the INCOMING slide to its starting position (above or below)
            gsap.set(slides[newIndex], {
              yPercent: 105 * direction,
            });

            // C. Animate the INCOMING slide exactly into the center
            gsap.to(slides[newIndex], {
              yPercent: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.inOut",
            });

            // Update the tracker
            currentIndex = newIndex;
          }
        },
      });
    });

    return () => mm.revert();
  },
  { scope: sectionRef },
);

  return (
    <section className={styles.container} ref={sectionRef}>
      <h2 className={styles.title}>Global Impact</h2>

      <div className={styles.sliderContainer}>
        {/* SLIDE 1 */}
        <div className={styles.slide}>
          <Bento
            stat1="500K+"
            label1="Moment of Calm Participants"
            stat2="100K+"
            label2="Meatless Day Supporters"
          />
        </div>

        {/* SLIDE 2 */}
        <div className={styles.slide}>
          <Bento
            stat1="250K+"
            label1="Meditation Downloads"
            stat2="80K+"
            label2="Wellness Workshops"
          />
        </div>

        {/* SLIDE 3 */}
        <div className={styles.slide}>
          <Bento
            stat1="1M+"
            label1="Community Reach"
            stat2="300K+"
            label2="Global Volunteers"
          />
        </div>
      </div>
    </section>
  );
};

export default BentoSlider;

/* ---- Reusable Bento Layout (Unchanged) ---- */
const Bento = ({
  stat1,
  label1,
  stat2,
  label2,
}: {
  stat1: string;
  label1: string;
  stat2: string;
  label2: string;
}) => {
  return (
    <div className={styles.grid}>
      <div className={`${styles.card} ${styles.topLeft}`}>
        <h3 className={styles.number}>{stat1}</h3>
        <p className={styles.label}>{label1}</p>
      </div>

      <div
        className={`${styles.card} ${styles.imageCard} ${styles.bottomLeft}`}
      >
        <img src="/moment.png" alt="Moment" />
      </div>

      <div className={`${styles.card} ${styles.imageCard} ${styles.center}`}>
        <img src="/mediation.png" alt="Meditation" />
      </div>

      <div className={`${styles.card} ${styles.imageCard} ${styles.topRight}`}>
        <img src="/lotus.png" alt="Lotus" />
      </div>

      <div className={`${styles.card} ${styles.bottomRight}`}>
        <h3 className={styles.number}>{stat2}</h3>
        <p className={styles.label}>{label2}</p>
      </div>
    </div>
  );
};
