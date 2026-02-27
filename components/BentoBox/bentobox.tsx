"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./bentobox.module.css";

gsap.registerPlugin(ScrollTrigger);

const BentoBox = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cube = cubeRef.current;
    const section = sectionRef.current;
    if (!cube || !section) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 901px)", () => {
      let currentIndex = 0;

      // FIXED: Added <HTMLElement> so TypeScript knows what's in the array
      const faces = gsap.utils.toArray<HTMLElement>(`.${styles.face}`);

      // Initialize opacities (Front is visible, rest are hidden)
      gsap.set(faces, { opacity: 0 });
      gsap.set(faces[0], { opacity: 1 });

      ScrollTrigger.create({
        trigger: section,
        start: "center center",
        end: "+=2000",
        pin: true,
        onUpdate: (self) => {
          // Divide the scroll space into 3 zones
          let newIndex = 0;
          if (self.progress < 0.33) newIndex = 0;
          else if (self.progress < 0.66) newIndex = 1;
          else newIndex = 2;

          // Only trigger the animation when crossing into a new zone
          if (newIndex !== currentIndex) {
            currentIndex = newIndex;

            // 1. Auto-flip the cube
            gsap.to(cube, {
              rotateX: newIndex * -90, // 0, -90, or -180
              duration: 0.8,
              ease: "power2.inOut",
            });

            // 2. Crossfade the faces to hide the messy 3D edges
            // FIXED: Removed the (face: any) since 'faces' is now strictly typed
            faces.forEach((face, i) => {
              gsap.to(face, {
                opacity: i === newIndex ? 1 : 0,
                duration: 0.5, // Slightly faster than the rotation
                ease: "power2.inOut",
              });
            });
          }
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section className={styles.container} ref={sectionRef}>
      <h2 className={styles.title}>Global Impact</h2>

      <div className={styles.scene}>
        <div className={styles.cube} ref={cubeRef}>
          {/* FACE 1: FRONT */}
          <div className={`${styles.face} ${styles.front}`}>
            <Bento
              stat1="500K+"
              label1="Moment of Calm Participants"
              stat2="100K+"
              label2="Meatless Day Supporters"
            />
          </div>

          {/* FACE 2: TOP */}
          <div className={`${styles.face} ${styles.top}`}>
            <Bento
              stat1="250K+"
              label1="Meditation Downloads"
              stat2="80K+"
              label2="Wellness Workshops"
            />
          </div>

          {/* FACE 3: BACK/BOTTOM */}
          <div className={`${styles.face} ${styles.back}`}>
            <Bento
              stat1="1M+"
              label1="Community Reach"
              stat2="300K+"
              label2="Global Volunteers"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoBox;

/* ---- Reusable Bento Layout ---- */
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
