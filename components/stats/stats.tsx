"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./stats.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const statItems = gsap.utils.toArray<HTMLElement>(`.${styles.statItem}`);

      statItems.forEach((item) => {
        // EXACTLY YOUR ORIGINAL ANIMATION
        ScrollTrigger.create({
          trigger: item,
          start: "top bottom",
          end: "top 25%",
          scrub: true,
          onUpdate: (self) => {
            const xValue = 250 - self.progress * 250;
            gsap.set(item, { x: xValue });
          },
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className={styles.stats}>
      <header className={styles.statsHeader}>
        <div className={styles.statsHeaderCopy}>
          <h3>Lab Overview</h3>
          <p>
            A concise snapshot of scale activity and ongoing output across the
            lab and studio practice.
          </p>
        </div>
      </header>

      <div className={styles.statsContent}>
        <div className={styles.statItem}>
          <h1>4</h1>
          <div className={styles.statImage}>
            <img src="/img1.jpeg" alt="Deadspace Studio" />
          </div>
          <div>
            <h3>Years of growth across studio and lab operations</h3>
            <p>Deadspace Studio</p>
          </div>
        </div>

        <div className={styles.statItem}>
          <h1>100</h1>
          <div className={styles.statImage}>
            <img src="/img2.jpeg" alt="Lab Archive" />
          </div>
          <div>
            <h3>Documented engagements during recent releases</h3>
            <p>Lab Archive</p>
          </div>
        </div>

        <div className={styles.statItem}>
          <h1>30</h1>
          <div className={styles.statImage}>
            <img src="/img3.jpeg" alt="Applied Research" />
          </div>
          <div>
            <h3>Distinct system experiments deployed across client work</h3>
            <p>Applied Research</p>
          </div>
        </div>

        <div className={styles.statItem}>
          <h1>11</h1>
          <div className={styles.statImage}>
            <img src="/img4.jpeg" alt="Distributed Team" />
          </div>
          <div>
            <h3>Active contributors spanning design development</h3>
            <p>Distributed Team</p>
          </div>
        </div>
      </div>
    </section>
  );
}
