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

        // INITIAL STATE: Next slides start below. We don't need them to be transparent
        // initially if they are sliding up from out of frame.
        gsap.set(slides.slice(1), { yPercent: 100 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "center center",
            end: "+=2000",
            pin: true,
            scrub: 1,
          },
        });

        slides.forEach((slide, i) => {
          if (i === 0) return;
          const label = `step${i}`;

          // 1. OUTGOING SLIDE: Fades out completely in HALF the time (duration: 0.5)
          tl.to(
            slides[i - 1],
            {
              yPercent: -30, // Push it up slightly further
              scale: 0.85, // Shrink it a bit more to get out of the way
              opacity: 0,
              duration: 0.5, // Fades out twice as fast as the new one comes in!
              ease: "power2.inOut",
            },
            label,
          );

          // 2. INCOMING SLIDE: Takes the full duration (1.0) to slide up into place
          tl.to(
            slide,
            {
              yPercent: 0,
              duration: 1,
              ease: "power2.out",
            },
            label, // Starts at the exact same time as the outgoing slide
          );
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
