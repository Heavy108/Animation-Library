"use client";

import { useEffect, useRef } from "react";
import styles from "./HOverCard.module.css";

interface CardData {
  id: string;
  title: string;
  img: string;
}

const CARDS: CardData[] = [
  { id: "1", title: "Synthetic Silhouette", img: "/img1.jpeg" },
  { id: "2", title: "Red Form Study", img: "/img2.jpeg" },
  { id: "3", title: "Material Pause", img: "/img3.jpeg" },
  { id: "4", title: "Obscured Profile", img: "/img4.jpeg" },
];

const SVG_STROKE_1 = (
  <svg viewBox="0 0 2453 2273" fill="none">
    <path
      d="M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262"
      stroke="currentColor"
      strokeWidth="200"
      strokeLinecap="round"
    />
  </svg>
);

const SVG_STROKE_2 = (
  <svg viewBox="0 0 2250 2535" fill="none">
    <path
      d="M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012"
      stroke="currentColor"
      strokeWidth="200"
      strokeLinecap="round"
    />
  </svg>
);

function Card({ card, index }: { card: CardData; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<any>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { SplitText } = await import("gsap/SplitText");
      gsap.registerPlugin(SplitText);

      const container = containerRef.current;
      if (!container) return;

      const cardPaths = container.querySelectorAll<SVGPathElement>(
        `.${styles.svgStroke} path`,
      );

      const cardTitle = container.querySelector<HTMLElement>(
        `.${styles.cardTitle} h3`,
      );
      if (!cardTitle) return;

      const split = SplitText.create(cardTitle, {
        type: "words",
        mask: "words",
        wordsClass: styles.word,
      });

      gsap.set(split.words, { yPercent: 100 });

      cardPaths.forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = String(length);
        path.style.strokeDashoffset = String(length);
      });

      const handleEnter = () => {
        tlRef.current?.kill();
        tlRef.current = gsap.timeline();

        cardPaths.forEach((path) => {
          tlRef.current.to(
            path,
            {
              strokeDashoffset: 0,
              attr: { "stroke-width": 700 },
              duration: 1.5,
              ease: "power2.out",
            },
            0,
          );
        });

        tlRef.current.to(
          split.words,
          { yPercent: 0, duration: 0.75, ease: "power3.out", stagger: 0.075 },
          0.35,
        );
      };

      const handleLeave = () => {
        tlRef.current?.kill();
        tlRef.current = gsap.timeline();

        cardPaths.forEach((path) => {
          const length = path.getTotalLength();
          tlRef.current.to(
            path,
            {
              strokeDashoffset: length,
              attr: { "stroke-width": 200 },
              duration: 1,
              ease: "power2.out",
            },
            0,
          );
        });

        tlRef.current.to(
          split.words,
          {
            yPercent: 100,
            duration: 0.5,
            ease: "power3.out",
            stagger: { each: 0.05, from: "end" },
          },
          0,
        );
      };

      container.addEventListener("mouseenter", handleEnter);
      container.addEventListener("mouseleave", handleLeave);

      cleanup = () => {
        container.removeEventListener("mouseenter", handleEnter);
        container.removeEventListener("mouseleave", handleLeave);
        tlRef.current?.kill();
        split.revert();
      };
    };

    init();
    return () => cleanup?.();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.cardContainer} ${styles[`hcCard${index + 1}`]}`}
    >
      <div className={styles.cardImg}>
        <img src={card.img} alt={card.title} />
      </div>

      <div className={`${styles.svgStroke} ${styles.svgStroke1}`}>
        {SVG_STROKE_1}
      </div>

      <div className={`${styles.svgStroke} ${styles.svgStroke2}`}>
        {SVG_STROKE_2}
      </div>

      <div className={styles.cardTitle}>
        <h3>{card.title}</h3>
      </div>
    </div>
  );
}

export default function HoverCards() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>The Hover State</h1>
      </header>

      <div className={styles.row}>
        {CARDS.map((card, index) => (
          <Card key={card.id} card={card} index={index} />
        ))}
      </div>

      <footer className={styles.footer}>
        <h1>End of Interaction</h1>
      </footer>
    </div>
  );
}
