"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./timeline.module.css";

const timelineData = [
  {
    year: "Grasslands House", // Left side label
    title: "Foundation Built", // Right side title
    desc: "After joining Gurukul, my child began reminding us to forgive before reacting. The lessons didn’t just stay in class, they came home with us.",
    img: "/img1.jpeg",
  },
  {
    year: "Pinon Ranch",
    title: "Taking Root",
    desc: "We started seeing a profound shift in behavior. Patience became the default response instead of anger.",
    img: "/img2.jpeg",
  },
  {
    year: "Zinfandel",
    title: "Community Impact",
    desc: "The values expanded beyond our home. Neighbors started asking what changed, creating a ripple effect.",
    img: "/img3.jpeg",
  },
  {
    year: "Foothills",
    title: "Leading by Example",
    desc: "Taking on mentorship roles, guiding younger peers with the exact principles learned years prior.",
    img: "/img4.jpeg",
  },
  {
    year: "12 Moons",
    title: "Lasting Change",
    desc: "A complete transformation in perspective, proving that these foundational values carry through a lifetime.",
    img: "/img5.jpeg",
  },
];

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // We don't register ScrollTrigger here since it's registered globally in page.tsx
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const newIndex = Math.round(
            self.progress * (timelineData.length - 1),
          );
          if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeIndex]);

  return (
    <div ref={containerRef} className={styles.scrollArea}>
      <div className={styles.stickyContainer}>
        <div className={styles.layoutGrid}>
          {/* Left: The Circular Image & Arc System */}
          <div className={styles.circleSystem}>
            {/* The visible thin line semi-circle */}
            <div className={styles.arcLine} />

            {/* The Center Image Mask */}
            <div className={styles.imageCenter}>
              {timelineData.map((item, index) => (
                <div
                  key={`img-${index}`}
                  className={`${styles.imageWrapper} ${
                    index === activeIndex ? styles.active : ""
                  }`}
                >
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className={styles.image}
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {/* The Dots and Text mapped to the Arc */}
            {timelineData.map((item, index) => {
              const isActive = index === activeIndex;
              // 22 degrees of separation between each item on the arc
              const angle = (activeIndex - index) * 22;

              // Fade out items that rotate too far out of view
              const opacity =
                Math.abs(index - activeIndex) > 3 ? 0 : isActive ? 1 : 0.4;

              return (
                <div
                  key={`dot-${index}`}
                  className={`${styles.dotContainer} ${isActive ? styles.active : ""}`}
                  style={{
                    // 1. Rotate to the angle
                    // 2. Push out to the radius (250px is half of arcLine's 500px width)
                    // 3. Rotate back so the text stays perfectly horizontal
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(-250px) rotate(${-angle}deg)`,
                    opacity: opacity,
                  }}
                >
                  <div className={styles.label}>{item.year}</div>
                  <div className={styles.dot} />
                </div>
              );
            })}
          </div>

          {/* Right: The Changing Text Content */}
          <div className={styles.textContent}>
            {timelineData.map((item, index) => (
              <div
                key={`text-${index}`}
                className={`${styles.textWrapper} ${
                  index === activeIndex ? styles.active : ""
                }`}
              >
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.description}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
