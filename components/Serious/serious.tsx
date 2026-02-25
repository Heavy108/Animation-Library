"use client";

import { useRef } from "react";
import styles from "./serious.module.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

type CardType = {
  title: string;
  copy: string;
};

const Card = ({ title, copy, index }: CardType & { index: number }) => {
  return (
    <div className={`${styles.card} ${styles[`card${index + 1}`]}`}>
      <div className={styles.cardInner}>
        <div className={styles.cardContent}>
          <h1>{title}</h1>
          <p>{copy}</p>
        </div>
        <div className={styles.cardImg}>
          <img src={`/assets/card-${index + 1}.jpeg`} alt={title} />
        </div>
      </div>
    </div>
  );
};

export default function Serious() {
  const container = useRef<HTMLDivElement>(null);

  const cards: CardType[] = [
    {
      title: "Brand Foundation",
      copy: "The heart of your company’s story. It shapes your vision, values, and voice, ensuring a clear and powerful impact in every interaction.",
    },
    {
      title: "Design Identity",
      copy: "Your brand's visual fingerprint. It crafts a distinctive look that sparks recognition and builds emotional connections with your audience.",
    },
    {
      title: "Digital Presence",
      copy: "Our web solutions combine cutting-edge design and seamless functionality to create experiences that captivate and inspire your audience.",
    },
    {
      title: "Product Design",
      copy: "We craft user-first products that are both functional and visually appealing, delivering solutions that leave a lasting impression.",
    },
  ];

  useGSAP(
    () => {
      const cardsEl = gsap.utils.toArray(`.${styles.card}`);

      ScrollTrigger.create({
        trigger: cardsEl[0] as Element,
        start: "top 35%",
        endTrigger: cardsEl[cardsEl.length - 1] as Element,
        end: "top 30%",
        pin: `.${styles.intro}`,
        pinSpacing: false,
      });

      cardsEl.forEach((card: any, index: number) => {
        const isLastCard = index === cardsEl.length - 1;
        const cardInner = card.querySelector(`.${styles.cardInner}`);

        if (!isLastCard) {
          ScrollTrigger.create({
            trigger: card,
            start: "top 35%",
            endTrigger: `.${styles.outro}`,
            end: "top 65%",
            pin: true,
            pinSpacing: false,
          });

          gsap.to(cardInner, {
            y: `-${(cardsEl.length - index) * 14}vh`,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 35%",
              endTrigger: `.${styles.outro}`,
              end: "top 65%",
              scrub: true,
            },
          });
        }
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container },
  );

 return (
   <div className={styles.wrapper} ref={container}>
     <section className={styles.hero}>
       <img src="/assets/hero.jpeg" alt="" />
     </section>

     <section className={styles.intro}>
       <h1>
         Creating standout brands for startups that bring joy and leave lasting
         impressions.
       </h1>
     </section>

     <section className={styles.cards}>
       {cards.map((card, index) => (
         <Card key={index} {...card} index={index} />
       ))}
     </section>

     {/* <section className={styles.outro}>
       <h1>Let’s build a brand that leaves a mark.</h1>
     </section> */}
   </div>
 );
}
